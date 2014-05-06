 module LowRezJam {
     export class Door {
         public Position: Point;
         public Open: boolean;
         public OpenAmount: number;

         constructor(pos: Point) {
             this.Position = pos;
             this.Open = false;
             this.OpenAmount = 0;
         }
     }
 }