import 'babel-polyfill'
import 'coffeekraken-sugar/js/features/all'
import SDeployTransitionComponent from '../../../dist/index'

const $transitionElm = document.querySelector('s-deploy-transition')
$transitionElm.animateIn().then(() => {
  $transitionElm.animateOut()
})
