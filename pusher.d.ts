declare global {
    interface Window {
        Echo: any; 
        Pusher: any; 

    }

  }

  interface CustomWindow extends Window {
    Echo? : any;
    Pusher?: any;
  }

  export const customWindow: CustomWindow;

