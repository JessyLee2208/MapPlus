function fitBoundsHandler(view, bounds) {
  if (view.geometry) {
    if (view.geometry.viewport) {
      bounds.union(view.geometry.viewport);
    } else {
      bounds.extend(view.geometry.location);
    }
  }

  return bounds;
}

export { fitBoundsHandler };
