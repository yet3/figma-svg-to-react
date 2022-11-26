import { getOptions } from './getOptions.util';
import { OptionsKeys, Actions, IExportSvg } from '../shared/custom';

figma.on('run', async () => {
  const loadingNotification = figma.notify('React to SVG: Starting...', { timeout: 60000 });

  const nodes = figma.currentPage.selection;

  if (nodes.length === 0) {
    figma.notify('Error: At least 1 node has to be selected');
    figma.closePlugin();
    return;
  }

  const promises: Promise<IExportSvg>[] = [];

  for (const node of nodes) {
    if (typeof node.exportAsync === 'function') {
      promises.push(
        new Promise(async (resolve, reject) => {
          node
            .exportAsync({ format: 'SVG', svgIdAttribute: true })
            .then((bytes) => {
              resolve({
                id: Math.random().toString(),
                bytes: [...bytes],
                nodeName: node.name,
              });
            })
            .catch(reject);
        })
      );
    }
  }

  try {
    const svgs = await Promise.all(promises);
    figma.showUI(__html__, { width: 600, height: 700 });

    figma.ui.postMessage(
      JSON.stringify({
        type: 'run',
        svgs: svgs,
        options: await getOptions(),
      })
    );
    loadingNotification.cancel();
  } catch (e) {
    console.log(e);
    loadingNotification.cancel();
    figma.notify('There was an error during export!');
    figma.closePlugin();
  }
});

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
    case 'saveOptions': {
      Object.keys(action.options).forEach((key) => {
        figma.clientStorage.setAsync(key, action.options[key as OptionsKeys]);
      });
      break;
    }
  }
};
