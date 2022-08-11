const getNodeToExport = (nodes: SceneNode[] | readonly SceneNode[]): SceneNode | null | undefined => {
  return nodes[0];
  // for (const node of nodes) {
  //   switch (node.type) {
  //     case 'VECTOR': {
  //       return node;
  //     }
  //     case 'FRAME': {
  //       return findVectorNode(node.children);
  //     }
  //     case 'GROUP': {
  //       return findVectorNode(node.children);
  //     }
  //     case 'COMPONENT': {
  //       return findVectorNode(node.children);
  //     }
  //   }
  // }

  return null;
};

const getOptions = async () => {
  const options: Record<string, any> = {};
  const optionsKeys = await figma.clientStorage.keysAsync();
  const promises: Promise<void>[] = [];

  for (const key of optionsKeys) {
    promises.push(
      new Promise(async (resolve) => {
        try {
          options[key] = await figma.clientStorage.getAsync(key);
        } catch (e) {
          console.log(e);
        }
        resolve();
      })
    );
  }

  await Promise.all(promises);
  return options;
};

figma.on('run', async () => {
  const node = getNodeToExport(figma.currentPage.selection);

  if (node && typeof node.exportAsync === 'function') {
    figma.showUI(__html__, { width: 600, height: 700 });

    try {
      const bytes = await node.exportAsync({ format: 'SVG' });
      const svgString = String.fromCharCode(...bytes);
      figma.ui.postMessage(
        JSON.stringify({
          type: 'run',
          svg: svgString,
          width: node.width,
          height: node.height,
          options: await getOptions(),
        })
      );
    } catch (e) {
      console.log(e);
      figma.notify('There was an error during export!');
      figma.closePlugin();
    }
  } else {
    figma.notify('Vector not selected!');
    figma.closePlugin();
  }
});

type Actions =
  | {
      type: 'notify';
      msg: string;
    }
  | {
      type: 'onCopy';
    }
  | { type: 'closePlugin' }
  | { type: 'saveOptions'; options: Record<string, boolean> };

figma.ui.onmessage = (action: Actions) => {
  switch (action.type) {
    case 'notify': {
      figma.notify(action.msg);
      break;
    }
    case 'closePlugin': {
      figma.closePlugin();
      break;
    }
    case 'onCopy': {
      figma.notify('Copied to clipboard!');
      figma.closePlugin();
      break;
    }
    case 'saveOptions': {
      Object.keys(action.options).forEach((key) => {
        figma.clientStorage.setAsync(key, action.options[key]);
      });
      break;
    }
  }
};
