/**
 * jquery.hoverspin.js
 *
 * Rotate images since 09/03/13 w/ http://basili.co
 *
 * Author: Dharma Ferrari (@dharmastyle)
 * Author: Marco Bozzola (@bozma88)
 *
 * Thanks @a2co_utd for the first proto!
 */
;(function( $ ) {

  // Default options
  var settings = {
    // Number of animation frames of a full axial revolution
    // For instance: 9 frames equals to 40° movement per picture
    frames: 9,
    // Number of times the revolution should repeat throughout an edge-to-edge swipe
    loops: 1,
    // Display useful debug markup
    debug: false,
    // The fixed container (will be removed in the near future)
    container: '.container',
    // Whether to avoid page scroll ON touch devices while spinning
    disableTouchPropagation: true
  };

  // Plugin constructor
  $.fn.hoverSpin = function(options) {
    return this.find('.sprite').each(function() {
      // jQuery cache
      var $this = $(this);

      // Merge settings
      this.settings = $.extend({}, settings, options, $this.data());

      // Properties
      this.$container = $this.closest( this.settings.container );
      this.$spriteWrapper = $this;
      this.$sprites = $this.children();
      this.$firstSprite = this.$sprites.filter(":first");
      this.currentStep = 1;
      this.currentFrame = 1;
      this.offset = 0;
      this.isMultiframe = this.$sprites.length > 1;

      // Methods
      this.goToFrame = function(frame) {
        var
          $target,
          property,
          goTo = (frame-1) * 100;

        if (this.isMultiframe) {
          $target = this.$firstSprite;
          property = 'marginTop';
        } else {
          $target = this.$spriteWrapper;
          property = 'top';
        }
        $target.css(property, '-'+goTo+'%');
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
        return this.$spriteWrapper.width() / this.getTotalSteps();
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
          this.$spriteWrapper.parent().find('.hoverspin-debug-active').removeClass('hoverspin-debug-active');
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
        if (frame == this.getCurrentFrame()) { return; }
        this.setCurrentStep(step);
        this.setCurrentFrame(frame);
        this.goToFrame(frame);
        if (this.settings.disableTouchPropagation) {
          event.preventDefault();
        }
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
          this.$spriteWrapper.closest('.application-content').append(
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
