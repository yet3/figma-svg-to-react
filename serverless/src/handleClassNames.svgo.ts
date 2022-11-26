const parseClassName = (className: string) => {
  return className.replace(/ /gm, '');
};

export function handleClassNames(root: any, opts: { onlyRemoveFirstGroup: boolean; makeExactClassNames: boolean }) {
  const { onlyRemoveFirstGroup = false, makeExactClassNames = false } = opts;

  let baseClassName = '';
  const rootEl = root.children[0];
  if (rootEl.isElem('svg')) {
    if (rootEl.children.length === 1) {
      const el = rootEl.children[0];
      if (el.hasAttr('id') && el.isElem('g')) {
        baseClassName = parseClassName(el.attributes.id);
        if (!onlyRemoveFirstGroup) rootEl.attributes.className = baseClassName;
        rootEl.children = el.children;
      }
    }
  }
  if (onlyRemoveFirstGroup) return root;

  const goThroughChildren = (node: any, accCN = '') => {
    if (node.hasAttr('id')) {
      if (makeExactClassNames) node.attributes.className = node.attributes.id;
      else {
        accCN += '__' + parseClassName(node.attributes.id);
        node.attributes.className = accCN;
      }
      delete node.attributes.id;
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {
        goThroughChildren(child, accCN);
      });
    }
  };

  goThroughChildren(rootEl, baseClassName);

  return root;
}
