import OBR from "https://unpkg.com/@owlbear-rodeo/sdk@latest/dist/obr.js";

const ID = "com.simple.marker";

OBR.onReady(() => {
  // Create the context menu item that appears on right-click
  OBR.contextMenu.create({
    id: `${ID}/menu`,
    icons: [
      {
        icon: "https://www.owlbear.rodeo/logo.svg",
        label: "Mark Token",
        filter: {
          every: [
            { key: "type", value: "IMAGE" },
            { key: "layer", value: "CHARACTER" }
          ],
        },
      },
    ],
    async onClick(context) {
      const tokenIds = context.items.map(item => item.id);
      const allItems = await OBR.scene.items.getItems();
      
      // Look for any existing markers attached to the selected tokens
      const markersToRemove = allItems.filter(item => 
        item.attachedTo && 
        tokenIds.includes(item.attachedTo) && 
        item.metadata?.[`${ID}/isMarker`]
      ).map(i => i.id);

      if (markersToRemove.length > 0) {
        // If markers exist, delete them (Toggle Off)
        await OBR.scene.items.deleteItems(markersToRemove);
      } else {
        // If no markers exist, create them (Toggle On)
        const markers = context.items.map((token) => {
          return OBR.scene.items.buildShape()
            .width(token.width)
            .height(token.height)
            .shapeType("CIRCLE")
            .fillColor("#ff0000")
            .fillOpacity(0.4)
            .strokeColor("#000000")
            .strokeWidth(2)
            .position(token.position)
            .attachedTo(token.id)
            .layer("ATTACHMENT")
            .locked(true)
            .disableHit(true)
            .metadata({ [`${ID}/isMarker`]: true })
            .build();
        });
        await OBR.scene.items.addItems(markers);
      }
    }
  });
});
