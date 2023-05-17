export type RotateDirection = "up" | "down" | "left" | "right";

export function rotateElement(
  element: Nullable<HTMLElement>,
  direction: RotateDirection
): Nullable<HTMLElement> {
  const parent = element?.parentElement;
  if (!element || !parent) {
    return null;
  }

  type ElementPosition = Omit<DOMRect, "x" | "y" | "toJSON">;

  const getPosition = (element: HTMLElement): ElementPosition => {
    const rect = element.getBoundingClientRect();
    const { left, right, top, bottom, width, height } = rect;
    return { left, right, top, bottom, width, height };
  };

  const isInBoundsX = (origin: ElementPosition, target: ElementPosition) => {
    return origin.left <= target.right && origin.right >= target.left;
  };

  const isInBoundsY = (origin: ElementPosition, target: ElementPosition) => {
    return origin.top <= target.bottom && origin.bottom >= target.top;
  };

  const isValidPosition = (
    origin: ElementPosition,
    target: ElementPosition,
    direction: RotateDirection
  ) => {
    return (
      (direction === "up" && origin.top > target.bottom && isInBoundsX(target, origin)) ||
      (direction === "down" && origin.bottom < target.top && isInBoundsX(target, origin)) ||
      (direction === "left" && origin.left > target.right && isInBoundsY(target, origin)) ||
      (direction === "right" && origin.right < target.left && isInBoundsY(target, origin))
    );
  };

  const getAxisDistance = (
    origin: ElementPosition,
    target: ElementPosition,
    direction: RotateDirection
  ) => {
    switch (direction) {
      case "up":
        return origin.top - target.top;
      case "down":
        return target.top - origin.top;
      case "left":
        return origin.left - target.left;
      case "right":
        return target.left - origin.left;
    }
  };

  const getDistance = (
    origin: ElementPosition,
    target: ElementPosition,
    direction: RotateDirection
  ) => {
    let d1: number;
    let d2: number;
    switch (direction) {
      case "up":
        d1 = Math.hypot(origin.left - target.left, origin.top - target.bottom);
        d2 = Math.hypot(origin.right - target.right, origin.top - target.bottom);
        return Math.min(d1, d2);
      case "down":
        d1 = Math.hypot(origin.left - target.left, target.top - origin.bottom);
        d2 = Math.hypot(origin.right - target.right, target.top - origin.bottom);
        return Math.min(d1, d2);
      case "left":
        d1 = Math.hypot(origin.right - target.left, origin.top - target.top);
        d2 = Math.hypot(origin.right - target.left, origin.bottom - target.bottom);
        return Math.min(d1, d2);
      case "right":
        d1 = Math.hypot(target.left - target.right, origin.top - target.top);
        d2 = Math.hypot(target.left - target.right, origin.bottom - target.bottom);
        return Math.min(d1, d2);
    }
    return 0;
  };

  const doGetNextElement = (origin: HTMLElement, direction: RotateDirection) => {
    const originData = getPosition(origin);

    let next: HTMLElement | null = null;
    let minDistance = Infinity;
    let axisMinDistance = Infinity;

    for (const target of Array.from(parent.children)) {
      if (target === origin || !(target instanceof HTMLElement)) continue;

      const targetData = getPosition(target);
      if (!isValidPosition(originData, targetData, direction)) continue;

      const axisDistance = getAxisDistance(originData, targetData, direction);
      if (axisDistance > 0 && axisDistance <= axisMinDistance) {
        if (axisDistance < axisMinDistance) {
          axisMinDistance = axisDistance;
          minDistance = Infinity;
        }
        const distance = getDistance(originData, targetData, direction);
        if (distance > 0 && distance < minDistance) {
          next = target;
          minDistance = distance;
        }
      }
    }

    return next;
  };

  let result = doGetNextElement(element, direction);
  if (result != null) {
    return result;
  }

  const opposite =
    direction === "up"
      ? "down"
      : direction === "down"
      ? "up"
      : direction === "left"
      ? "right"
      : "left";

  result = doGetNextElement(element, opposite);
  while (result != null) {
    const next = doGetNextElement(result, opposite);
    if (next == null) {
      return result;
    }
    result = next;
  }
  return null;
}
