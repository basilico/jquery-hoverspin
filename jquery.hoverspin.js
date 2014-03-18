/**
 * jquery.hoverSpin.js
 *
 * Author: Dharma Ferrari (@dharmastyle)
 *
 * rotate images since 09/03/13 w/ http://basili.co
 * thanks @a2co_utd for the first proto
 *
 * @TODO: add click and drag
 */
;(function( $ ) {

  // Default options
  var settings = {
    // Number of animation frames (9 frames equals a 40° degrees movement)
    frames: 9,
    // Number of times the animation should repeat
    loops: 1,
    // If print useful debug markup
    debug: false,
    // The *REAL* container identifier
    container: '.container'
  };

  // Plugin constructor
  $.fn.hoverSpin = function(options) {
    return this.find('.sprite').each(function() {
      // jQuery cache
      var $this = $(this);

      // Merge settings
      this.settings = $.extend({}, settings, options, $this.data());

      // Properties
      this.$ = $this;
      this.$container = $this.closest( this.settings.container );
      this.currentStep = 1;
      this.currentFrame = 1;
      this.offset = 0;

      // Methods

      this.goToFrame = function(frame) {
        var goTo = (frame-1) * 100;
        this.$.css('top','-'+goTo+'%');
      };

      this.calculateFrameByStep = function(step) {
        var
          loop = this.calculateLoopByStep(step),
          prevLoop = loop - 1,
          frame = step - prevLoop * this.getTotalFrames();
        return frame;
      };

      this.calculateCurrentStep = function(event) {
        var
          x = this.calculatePointerX(event),
          w = this.calculateStepWidth(),
          step = Math.ceil(x/w);
        return step;
      };

      this.calculatePointerX = function(event) {
        var mousex = event.originalEvent.touches ? event.originalEvent.touches[0].pageX : event.pageX;
        return Math.abs(mousex - this.calculateAbsoluteLeft());
      };

      this.calculateAbsoluteLeft = function() {
        return this.$container.position().left;
      };

      this.calculateStepWidth = function() {
        return this.$.width() / this.getTotalSteps();
      };

      this.calculateLoopByStep = function(step) {
        return Math.ceil(step / this.getTotalFrames());
      };

      // Offset gettersetter
      this.getOffset = function() {
        return this.offset;
      };
      this.setOffset = function(offset) {
        this.offset = offset;
      };

      // Steps gettersetter
      this.getTotalSteps = function() {
        return this.settings.loops * this.settings.frames;
      };
      this.getCurrentStep = function() {
        return this.currentStep;
      };
      this.setCurrentStep = function(step) {
        if(this.settings.debug) {
          this.$.parent().find('.hoverspin-debug-active').removeClass('hoverspin-debug-active');
          $('#'+this.id+step).addClass('hoverspin-debug-active');
        }
        this.currentStep = step;
      };

      // Frames gettersetter
      this.getTotalFrames = function() {
        return this.settings.frames;
      };
      this.getCurrentFrame = function() {
        return this.currentFrame;
      };
      this.setCurrentFrame = function(frame) {
        this.currentFrame = frame;
      };


      // Mouse/Touch events

      this._enter = function(event) {
        var offset = this.getCurrentFrame()-this.calculateCurrentStep(event);
        this.setOffset(offset);
      };

      this._move = function(event) {
        var
          step = this.calculateCurrentStep(event) + this.getOffset(),
          frame = this.calculateFrameByStep(step);
        this.setCurrentStep(step);
        this.setCurrentFrame(frame);
        this.goToFrame(frame);
      };

      this._leave = function(event) {

      };


      /**
       * Constructor
       */
      this.init = function() {
        // set initial frame
        if(this.settings.startAt !== undefined && this.settings.startAt > 1) {
          this.setCurrentFrame(this.settings.startAt);
          this.goToFrame(this.settings.startAt);
        }
        // enable debug
        if(this.settings.debug) {
          this.debug();
        }
      };

      /**
       * Displays useful frame/steps bars
       */
      this.debug = function() {
        appendDebugStyle();
        for(var i=0; i<this.getTotalSteps(); i++){
          var step = i+1;
          this.$.closest('.application-content').append(
            '<div id="'+ this.id+step +'" class="hoverspin-debug-step" style="width:'+(this.calculateStepWidth()-1)+'px; left:'+(this.calculateStepWidth()*i)+'px;">' +
              this.calculateFrameByStep(step) +
            '</div>'
          );
        }
      };

      // Bootstrap
      this.init();

      $this
        .on('mouseenter touchstart', this._enter)
        .on('mouseleave touchend', this._leave)
        .on('mousemove touchmove', this._move);
    });
  };


  /**
   * Debug
   * @param  {string} msg     Text to debug
   * @param  {string} logType Type of logging (log, error, info, warn)
   */
  function debug(msg, logType) {
    logType = logType!==undefined ? logType : 'log';
    if (msg && window.console) {
      console[logType](msg);
    }
  }

  /**
   * Append CSS Style to body for debug purpose
   */
  function appendDebugStyle() {
    var
      css = '.hoverspin-debug-active{ font-weight:bold; background:#000; color:#fff; }';
      css+= '.hoverspin-debug-step{ text-align:center; border-right:1px solid #000; position:absolute; top:0; }';
    $('head').append('<style>'+css+'</style>');
  }

}( jQuery ));
