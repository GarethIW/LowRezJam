 module LowRezJam {
     export class Door {
         public Position: Point;
         public Open: boolean;
         public OpenAmount: number;

         private opening = false;
         private closing = false;

         constructor(pos: Point) {
             this.Position = pos;
             this.Open = false;
             this.OpenAmount = 0;
         }

         public Update(time) {
             if (this.opening) {
                 if (this.OpenAmount < 31) this.OpenAmount++;
                 else {
                     this.Open = true;
                     this.opening = false;
                 }
             }

             if (this.closing) {
                 if (this.OpenAmount > 0) this.OpenAmount--;
                 else {
                     this.Open = false;
                     this.closing = false;
                 }
             }
         }

         public Clicked(pos: Point) {
             if (this.opening || this.closing) return;

             if (this.Open) {
                 this.closing = true;
                 this.Open = false;
             }
             else this.opening = true;
         }
     }
 }