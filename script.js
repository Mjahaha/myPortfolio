import { Blobby } from './javascript/blobby.js';
import { executeFlicker } from './javascript/flickeringText.js';
import { createGallery  } from './javascript/gallery.js';

// using these as inspiration https://yasio.dev/  https://thieb.co/  

// Create and display blobby 
//new Blobby(["navBarInHeader", "headerLogo"]);
new Blobby(["myName"]);
executeFlicker();
createGallery('galleryOne');
createGallery('galleryTwo');


