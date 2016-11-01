;(function () {

  var vuePointer = {}
  var PointerTracker = typeof require === 'function'
    ? require('pointer')
    : window.PointerTracker
  var pointerEvents = ['pointerup', 'pointerdown', 'pointermove', 'pointerover', 'pointerenter', 'pointerout', 'pointerleave', 'pointercancel']

  if (!PointerTracker) {
    throw new Error('[vue-pointer] cannot locate pointer.js.')
  }

  // exposed global options
  vuePointer.config = {}

  vuePointer.install = function (Vue) {

    Vue.directive('pointer', {

      // isFn: true,
      // acceptStatement: true,
      // priority: Vue.directive('on').priority,

      bind: function (el, binding) {      

        // If there is no pointer tracker instance on this element
        // yet, go ahead and init one
        if (!el.pointerTracker) {
          el.pointerTracker = new PointerTracker(el)
        }

        // Should we use event capture
        var useCapture = binding.modifiers && binding.modifiers['capture'] ? true : false;
        
        // See what event we care about listening to
        var event = binding.arg
        if (!event) {
          console.warn('[vue-pointer] event type argument is required.')
          return
        }

        // See if the event is a valid one to listen to, then bind it,
        // otherwise we are done
        //
        // We also save a ref to the func, so we can compare and unbind
        // in later lifecycle steps as necessary
        for (var i = 0; i < pointerEvents.length; i++) {
          if (event.indexOf(pointerEvents[i]) === 0) {
            el.addEventListener(event, binding.value, useCapture)
            el.event = binding.value
            break
          }
        }
      },

      update: function (el, binding) {

        // Should we use event capture
        var useCapture = binding.modifiers && binding.modifiers['capture'] ? true : false;

        // Remove our old func, if one exists
        if (el.event) {
          el.removeEventListener(event, el.event, useCapture)
        }

        // See what event we care about listening to
        var event = binding.arg
        if (!event) {
          console.warn('[vue-pointer] event type argument is required.')
          return
        }

        // See if the event is a valid one to listen to, then bind it,
        // otherwise we are done
        //
        // We also save a ref to the func, so we can compare and unbind
        // in later lifecycle steps as necessary
        for (var i = 0; i < pointerEvents.length; i++) {
          if (event.indexOf(pointerEvents[i]) === 0) {
            el.addEventListener(event, binding.value, useCapture)
            el.event = binding.value
            break
          }
        }
      },

      unbind: function () {

        // Should we use event capture
        var useCapture = binding.modifiers && binding.modifiers['capture'] ? true : false;

        // Remove our old func, if one exists
        if (el.event) {
          el.removeEventListener(event, el.event, useCapture)
        }

        // Tear down our capture instance
        el.pointerTracker = null
      }
    })

  }

  /**
   * Add our plugin to the global instance
   */
  if (typeof exports == "object") {
    module.exports = vuePointer
  } else if (typeof define == "function" && define.amd) {
    define([], function(){ return vuePointer })
  } else if (window.Vue) {
    window.vuePointer = vuePointer
    Vue.use(vuePointer)
  }

})()