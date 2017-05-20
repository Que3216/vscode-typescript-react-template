## Typescript React Template

If you create a new `.tsx` file called `MyComponent.tsx`, it'll initialize it with the following contents:

```
import * as React from "react";

export interface MyComponentProps {
}

export interface MyComponentState {
}

export class MyComponent extends React.PureComponent<MyComponentProps, MyComponentState> {
   render() {
       return (
           <div>
               Hello World
           </div>
       );
   }
}
```
