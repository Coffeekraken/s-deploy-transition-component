import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import { TweenMax, TimelineMax, Expo } from 'gsap'
import dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'
import debounce from 'coffeekraken-sugar/js/utils/functions/debounce'

/**
 * Create a nice layered transition for your webapp with fully customizable look and feel.
 * @example    html
 * <s-layers-transition layers="[{color:'#ff0000',side:'left'},{color:'#00ff00',side:'right'}]"></s-layers-transition>
 *
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
 * @see    https://ddd.ge    Inspiration source
 */
export default class SLayersTransitionComponent extends SWebComponent {
  /**
   * Default props
   * @definition    SWebComponent.defaultProps
   * @protected
   */
  static get defaultProps () {
    return {

      /**
       * Specify the delay in second between each layers animations
       * @prop
       * @type    {Number}
       */
      delay: 0.05,

      /**
       * Specify the duration of 1 layer animation in second
       * @prop
       * @type    {Number}
       */
      duration: 1,

      /**
       * Set the layers. One layer in composed of:
       * ```js
       * {
       *  color: '#ff0000'
       * }
       * ```
       *
       * @prop
       * @type    {Array<Object>}
       */
      layers: [{
        color: '#242c2f'
      }, {
        color: '#f2bc2b'
      }]
    }
  }

  /**
   * Css
   * @protected
   */
  static defaultCss (componentName, componentNameDash) {
    return `
      ${componentNameDash} {
        display: block;
        pointer-events: none;
        transition: width 0.01s linear 0s, height 0.01s linear 0s;
      }
      ${componentNameDash}.active {
        pointer-events: all;
      }
    `
  }

  /**
   * Component will mount
   * @definition    SWebComponent.componentWillMount
   * @protected
   */
  componentWillMount () {
    super.componentWillMount()

    // flags
    this._isTransitionIn = false
    this._isTransitionOut = false

    // layers
    this._layers = []

    // create a canvas to draw in
    this.$canvasElm = document.createElement('canvas')
    this.appendChild(this.$canvasElm)

    // set the layers
    this.props.layers.forEach((layer) => {
      this._addLayer(layer.color)
    })

    // listen for resize through transitionend event
    this.addEventListener('transitionend', debounce((e) => {
      // set points
      this._setPointPositionAndCanvasSize()
    }, 100))
  }

  /**
   * Set points position and canvas size
   */
  _setPointPositionAndCanvasSize () {
    const [w, h] = [this.offsetWidth, this.offsetHeight]
    // set canvas size
    this.$canvasElm.width = w
    this.$canvasElm.height = h
    // loop on each layers
    this._layers.forEach((layer) => {
      if (this._isTransitionIn) {
        layer.points[0] = { x: 0, y: h }
        layer.points[1] = { x: w, y: h }
        layer.points[3] = { x: 0, y: 0 }
      } else if (this._isTransitionOut) {
        layer.points[1] = { x: w, y: h }
        layer.points[2] = { x: w, y: 0 }
        layer.points[3] = { x: 0, y: 0}
      } else {
        layer.points[0] = { x: 0, y: h }
        layer.points[1] = { x: w, y: h }
        layer.points[2] = { x: 0, y: h }
        layer.points[3] = { x: 0, y: 0 }
      }
    })
  }

  /**
   * Component will receive prop
   * @definition    SWebComponent.componentWillReceiveProp
   * @protected
   */
  componentWillReceiveProp (name, newVal, oldVal) {
    switch (name) {
      case 'layers':
        this._layers = []
        // set the layers
        this.props.layers.forEach((layer) => {
          this._addLayer(layer.color)
        })
        break
    }
  }

  /**
   * Add a layer to be drawn
   * @param    {String}    color    The color of the layer
   * @private
   * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
   */
  _addLayer (color) {
    const [w, h] = [this.offsetWidth, this.offsetHeight]
    this._layers.push({
      color,
      points: [{ x: 0, y: h }, { x: w, y: h }, { x: 0, y: h }, { x: 0, y: 0 }]
    })
  }

  /**
   * Animate the transition in
   * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
   */
  animateIn () {
    return new Promise((resolve, reject) => {
      // add the active class
      this.classList.add('active')
      // flag
      this._isTransitionIn = true

      setTimeout(() => {
        const ctx = this.$canvasElm.getContext('2d')
        const [w, h] = [this.offsetWidth, this.offsetHeight]
        this.$canvasElm.width = w
        this.$canvasElm.height = h
        ctx.globalCompositeOperation = 'add'

        const tl = new TimelineMax({
          onComplete: () => {
            // flag
            this._isTransitionIn = false
            // promise
            resolve(this)
            /**
             * @event
             * @name    in:complete
             * Event dispatched when the transition in is completed
             */
            dispatchEvent(this, 'in:complete')
          },
          onUpdate: () => {
            ctx.clearRect(0, 0, w, h)

            this._layers.forEach((layer, i) => {
              ctx.beginPath()
              ctx.moveTo(layer.points[0].x, layer.points[0].y)
              ctx.lineTo(layer.points[1].x, layer.points[1].y)
              ctx.lineTo(layer.points[2].x, layer.points[2].y)
              ctx.lineTo(layer.points[3].x, layer.points[3].y)
              ctx.closePath()
              ctx.fillStyle = layer.color
              ctx.fill()
            })
          }
        })

        const d = this.props.duration

        this._layers.forEach((layer, i) => {
          tl.insert(new TweenMax(layer.points[2], d, { y: 0, x: w, ease: Expo.easeInOut }), this.props.delay * i)
        })
      })
    })
  }

  /**
   * Animate the transition out
   * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
   */
  animateOut () {
    return new Promise((resolve, reject) => {
      // flag
      this._isTransitionOut = true

      setTimeout(() => { // avoid flickering
        const ctx = this.$canvasElm.getContext('2d')
        const [w, h] = [this.offsetWidth, this.offsetHeight]
        this.$canvasElm.width = w
        this.$canvasElm.height = h
        ctx.globalCompositeOperation = 'add'

        const tl = new TimelineMax({
          onComplete: () => {
            // flag
            this._isTransitionOut = false
            // remove the active class
            this.classList.remove('active')
            // reset points
            this._layers.forEach((layer) => {
              layer.points = [{ x: 0, y: h }, { x: w, y: h }, { x: 0, y: h }, { x: 0, y: 0 }]
            })
            // promise
            resolve(this)
            /**
           * @event
           * @name    out:complete
           * Event dispatched when the transition out is completed
           */
            dispatchEvent(this, 'out:complete')
          },
          onUpdate: () => {
            ctx.clearRect(0, 0, w, h)

            this._layers.forEach((layer) => {
              ctx.beginPath()
              ctx.moveTo(layer.points[0].x, layer.points[0].y)
              ctx.lineTo(layer.points[1].x, layer.points[1].y)
              ctx.lineTo(layer.points[2].x, layer.points[2].y)
              ctx.lineTo(layer.points[3].x, layer.points[3].y)
              ctx.closePath()
              ctx.fillStyle = layer.color
              ctx.fill()
            })
          }
        })

        const d = this.props.duration

        this._layers.forEach((layer, i) => {
            tl.insert(new TweenMax(layer.points[0], d, { y: 0, x: w, ease: Expo.easeInOut }), this.props.delay * (this._layers.length - 1) - this.props.delay * i)
        })
      }, 10)
    })
  }
}
