(function (scope) {

    /**
     * Shape recognized
     *
     * @class ShapeRecognized
     * @extends ShapeCandidate
     * @param {Object} obj
     * @constructor
     */
    function ShapeRecognized (obj) {
        scope.ShapeCandidate.call(this, obj);
        this.primitives = [];
        if (obj) {
            this.label = obj.label;
            this.normalizedRecognitionScore = obj.normalizedRecognitionScore;
            this.resemblanceScore = obj.resemblanceScore;
            for (var i in obj.primitives) {
                var primitive;
                switch (obj.primitives[i].type) {
                    case 'line':
                        primitive = new scope.ShapeLine(obj.primitives[i]);
                        break;
                    case 'ellipse':
                        primitive = new scope.ShapeEllipse(obj.primitives[i]);
                        break;
                }
                this.primitives.push(primitive);
            }
        }
    }

    /**
     * Inheritance property
     */
    ShapeRecognized.prototype = new scope.ShapeCandidate();

    /**
     * Constructor property
     */
    ShapeRecognized.prototype.constructor = ShapeRecognized;

    /**
     *
     * @returns {Array}
     */
    ShapeRecognized.prototype.getPrimitives = function () {
        return this.primitives;
    };

    /**
     *
     * @returns {String}
     */
    ShapeRecognized.prototype.getLabel = function () {
        return this.label;
    };

    /**
     *
     * @returns {Number}
     */
    ShapeRecognized.prototype.getNormalizedRecognitionScore = function () {
        return this.normalizedRecognitionScore;
    };

    /**
     *
     * @returns {Number}
     */
    ShapeRecognized.prototype.getResemblanceScore = function () {
        return this.resemblanceScore;
    };

    // Export
    scope.ShapeRecognized = ShapeRecognized;
})(MyScript);