// Define custom map control to reset the map to its
// initial extent
export class NavigateToExtentControl {
  
  constructor(map) {
    this._map = map;
  }
  
  onAdd(){
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    const button = this._createButton();
    this._container.appendChild(button);
    return this._container;
  }
  
  onRemove(){
    this._container.parentNode.removeChild(this.container);
    this._map = undefined;
  }

  _createButton() {
    const el = window.document.createElement('button')
    el.className = 'mapboxgl-ctrl-icon material-icons zoom-to-extent';
    el.type = 'button';
    el.title = 'Reset extent to statewide';
    el.setAttribute('aria-label', 'Reset extent to statewide');
    el.textContent = 'home';
    el.addEventListener('click', (e) => {
      this._map.easeTo({
      center: [-99.7, 31.33],
      zoom: 5.7,
      pitch: 0,
      bearing: 0
      });
      e.stopPropagation();
    }, false)
    return el;
  }
}