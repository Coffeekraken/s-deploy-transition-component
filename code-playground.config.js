module.exports = {
  // server port
  port: 3000,

  // title
  title: 's-deploy-transition-component',

  // layout
  layout: 'right',

  // compile server
  compileServer: {

    // compile server port
    port: 4000

  },

  // demos
  demos: {
    'layers': {
      title: 'Layers',
      editors: {
        html: {
          language: 'html',
          data: `
            <button class="btn btn--primary" onClick="playTransition()">
              Play the transition again
            </button>
            <s-deploy-transition layers="[{color:'#d73020'},{color:'#feeead'},{color:'#78c39a'},{color:'#41a182'},{color:'#26372d'}]" delay="0.2"></s-deploy-transition>
          `
        }
      }
    },
    'delay': {
      title: 'Delay',
      editors: {
        html: {
          language: 'html',
          data: `
            <button class="btn btn--primary" onClick="playTransition()">
              Play the transition again
            </button>
            <s-deploy-transition delay="0.4"></s-deploy-transition>
          `
        }
      }
    },
    'duration': {
      title: 'Duration',
      editors: {
        html: {
          language: 'html',
          data: `
            <button class="btn btn--primary" onClick="playTransition()">
              Play the transition again
            </button>
            <s-deploy-transition duration="2"></s-deploy-transition>
          `
        }
      }
    }
  },

  // editors
  editors: {
    html: {
      language: 'html',
      data: `
        <button class="btn btn--primary" onClick="playTransition()">
          Play the transition again
        </button>
        <s-deploy-transition></s-deploy-transition>
      `
    },
    css: {
      language: 'scss',
      data: `
        @import 'node_modules/coffeekraken-sugar/index';
        @import 'node_modules/coffeekraken-s-typography-component/index';
        @import 'node_modules/coffeekraken-s-button-component/index';
        @include s-init();
        @include s-classes();
        @include s-typography-classes();
        @include s-button-classes();
        body {
          padding: s-space(bigger);
        }
        s-deploy-transition {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `
    },
    js: {
      language: 'js',
      data: `
        import 'babel-polyfill'
        import SDeployTransitionComponent from './dist/index'
        window.playTransition = async function() {
          const elm = await document.querySelector('s-deploy-transition').animateIn()
          await elm.animateOut()
        }
        playTransition()
      `
    }
  }
}
