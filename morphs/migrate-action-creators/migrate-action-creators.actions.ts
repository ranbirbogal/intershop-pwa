import { SourceFile, VariableDeclarationKind } from 'ts-morph';

export class ActionCreatorsActionsMorpher {
  actionTypes: { [typeName: string]: string };

  constructor(public actionsFile: SourceFile) {}

  private readActionTypes() {
    console.log('reading action types...');
    this.actionTypes = this.actionsFile
      .getEnums()[0]
      .getMembers()
      .reduce(
        (acc, current) => ({
          ...acc,
          [current.getName()]: current.getInitializer().getText(),
        }),
        {}
      );
  }

  replaceActions() {
    this.readActionTypes();
    console.log('replacing action classes with creator functions...');
    this.actionsFile.getClasses().forEach(actionClass => {
      // retrieve basic action information
      const className = actionClass.getName();
      const typeString = this.actionTypes[className];
      // get constructor information
      const hasConstructor = actionClass.getConstructors().length > 0;
      const constructorContents = hasConstructor
        ? actionClass
            .getConstructors()[0]
            .getParameter('payload')
            .getText()
            .replace('public ', '')
        : '';

      // assemble structure object
      const createActionStructure = {
        isExported: true,
        isDefaultExport: false,
        hasDeclareKeyword: false,
        docs: [],
        kind: 39,
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: className.charAt(0).toLowerCase() + className.substr(1),
            initializer: hasConstructor
              ? `createAction(${typeString}, props<{${constructorContents}}>())`
              : `createAction(${typeString})`,
            type: undefined,
            hasExclamationToken: false,
            kind: 38,
          },
        ],
      };
      // add variable statement to file
      this.actionsFile.addVariableStatement(createActionStructure);
      // remove class from file
      actionClass.remove();
    });
    // clean up old code
    this.actionsFile.getEnums()[0].remove();
    this.actionsFile.getTypeAliases()[0].remove();
    this.actionsFile.fixMissingImports();
    this.actionsFile.fixUnusedIdentifiers();
  }
}