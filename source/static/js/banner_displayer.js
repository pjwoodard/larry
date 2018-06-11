function BannerDisplayer() {
    
    // Member variables
    this.successful = false;
    this.error = false;
    this.success_message = "";
    this.error_message = "";

    this.display_success = function(message) {
        this.successful = true;
        this.success_message = message;
    };

    this.display_error = function(message) {
        this.error = true;
        this.error_message = message;
    }

    // Member functions
    this.clear_banner = function() {
        this.successful = false;
        this.error = false;
        this.success_message = "";
        this.error_message = "";
    };
};