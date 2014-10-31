(function (scope) {

    /**
     * Parameters used for math recognition
     *
     * @class MathParameter
     * @extends AbstractParameter
     * @constructor
     */
    function MathParameter () {
        this.resultTypes = [];
        this.userResources = [];
    }

    /**
     * Inheritance property
     */
    MathParameter.prototype = new scope.AbstractParameter();

    /**
     * Constructor property
     */
    MathParameter.prototype.constructor = MathParameter;

    /**
     * Get the math result types (e.g. LaTex, MathML, SymbolTree)
     * @returns {Array}
     */
    MathParameter.prototype.getResultTypes = function () {
        return this.resultTypes;
    };

    /**
     * Set the math result types (e.g. LaTex, MathML, SymbolTree)
     * @param {Array}
     */
    MathParameter.prototype.setResultTypes = function (resultTypes) {
        this.resultTypes = resultTypes;
    };

    /**
     * Get the user resources
     * @returns {Array}
     */
    MathParameter.prototype.getUserResources = function () {
        return this.userResources;
    };

    /**
     * Set the user resources
     * @param {Array}
     */
    MathParameter.prototype.setUserResources = function (userResources) {
        this.userResources = userResources;
    };

    /**
     * Get the sensitivity of the scratch-out detection
     * @returns {Number}
     */
    MathParameter.prototype.getScratchOutDetectionSensitivity = function () {
        return this.scratchOutDetectionSensitivity;
    };

    /**
     * Set the sensitivity of the scratch-out detection
     * @param {Number}
     */
    MathParameter.prototype.setScratchOutDetectionSensitivity = function (scratchOutDetectionSensitivity) {
        this.scratchOutDetectionSensitivity = scratchOutDetectionSensitivity;
    };

    // Export
    scope.MathParameter = MathParameter;
})(MyScript);