


fetch("https://glossary-fruits-voltage-spell.trycloudflare.com/maps/?profile=foot&layer=OpenStreetMap")
  .then(response => console.log(response))
  .catch(error => console.error("Error:", error));