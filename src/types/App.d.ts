export {};

declare global {
  interface Window {
    // This is defined later via the html5 up template JS imported in the HTML outside of this project.
    //  But want to call it via an Event Hook after the DOM is updated. Defining it here to
    //  avoid compilation errors calling something that is defined later/outside of the project.
    executeMainJs: any; 
  }
}