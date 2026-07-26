export const triggerFlyToCart = (startElement, targetElementId = 'floating-cart-icon') => {
  if (!startElement) return;

  const targetElement = document.getElementById(targetElementId);
  if (!targetElement) return;

  // Get bounding rects
  const startRect = startElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  // Create flying element
  const flyingNode = startElement.cloneNode(true);
  
  // Style it to be fixed and exactly where the start element is
  flyingNode.style.position = 'fixed';
  flyingNode.style.top = `${startRect.top}px`;
  flyingNode.style.left = `${startRect.left}px`;
  flyingNode.style.width = `${startRect.width}px`;
  flyingNode.style.height = `${startRect.height}px`;
  flyingNode.style.zIndex = '9999';
  flyingNode.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  flyingNode.style.pointerEvents = 'none'; // so it doesn't block clicks
  flyingNode.style.opacity = '0.8';
  flyingNode.style.borderRadius = '50%'; // make it circular for aesthetics
  flyingNode.style.objectFit = 'cover';

  document.body.appendChild(flyingNode);

  // Trigger animation after a tiny delay so the initial position renders
  requestAnimationFrame(() => {
    // Calculate end position (center of the target element)
    const endX = targetRect.left + targetRect.width / 2 - startRect.width / 4;
    const endY = targetRect.top + targetRect.height / 2 - startRect.height / 4;

    // Apply translation and scale down
    flyingNode.style.transform = `translate(${endX - startRect.left}px, ${endY - startRect.top}px) scale(0.2)`;
    flyingNode.style.opacity = '0.3';
  });

  // Remove element after animation finishes
  setTimeout(() => {
    if (document.body.contains(flyingNode)) {
      document.body.removeChild(flyingNode);
    }
  }, 800);
};
