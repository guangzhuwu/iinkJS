(function (scope) {

    /**
     * Music annotation
     *
     * @class MusicAnnotation
     * @extends AbstractMusicElement
     * @param {Object} obj
     * @constructor
     */
    function MusicAnnotation (obj) {
        scope.AbstractMusicElement.call(this, obj);
        if (obj) {
            this.label = obj.label;
        }
    }

    /**
     * Inheritance property
     */
    MusicAnnotation.prototype = new scope.AbstractMusicElement();

    /**
     * Constructor property
     */
    MusicAnnotation.prototype.constructor = MusicAnnotation;

    /**
     *
     * @returns {String}
     */
    MusicAnnotation.prototype.getLabel = function () {
        return this.label;
    };

    // Export
    scope.MusicAnnotation = MusicAnnotation;
})(MyScript);