import { Component, Input, signal, Type } from '@angular/core';

@Component({
  selector: 'app-section-collapse',
  imports: [],
  template: `
    <div class="shadow p-3 pb-5" animate.enter="collapse-down">
      Aliqua aute non fugiat aliquip tempor ullamco sunt veniam eu ea. Cillum aliquip excepteur
      officia do ut pariatur voluptate incididunt dolore nulla mollit ad culpa. Sit irure magna
      proident aliquip est eu magna ipsum mollit consequat. Et velit deserunt cillum eu nulla sunt
      laboris eiusmod mollit. Aliqua eiusmod sit commodo in commodo consectetur ullamco ipsum
      proident ut eiusmod ea commodo. Voluptate exercitation reprehenderit ea est deserunt anim
      cillum nisi Lorem proident culpa veniam duis. Ullamco cillum nulla cupidatat veniam
      reprehenderit. In culpa elit anim cupidatat Lorem dolor ut. Elit incididunt ex nulla
      consectetur irure veniam eiusmod elit ullamco culpa. Deserunt reprehenderit Lorem laboris quis
      eu quis consequat magna Lorem eu deserunt. Ullamco adipisicing labore deserunt aliqua.
      Pariatur tempor ex nulla amet. Cillum dolore et consequat dolor ullamco consectetur dolor
      commodo sit. Duis consequat ex in eu. Incididunt minim do voluptate ea anim dolor nisi
      deserunt. Enim dolore voluptate fugiat occaecat irure do sit. Lorem pariatur sunt sit est
      adipisicing ea ipsum nulla elit voluptate sunt elit cupidatat. Consequat ullamco excepteur eu
      ad ipsum anim reprehenderit id cillum aliquip Lorem. Sunt consequat ea occaecat Lorem ipsum
      magna laboris exercitation laborum cupidatat. In excepteur sunt est irure esse. Nulla qui id
      eu reprehenderit voluptate. Tempor ipsum non anim in ipsum reprehenderit. Ad qui labore duis
      id fugiat sit cupidatat est cupidatat proident do. Velit culpa officia nostrud adipisicing
      magna ea ut sunt. Lorem mollit consequat ea adipisicing quis in culpa dolore aliquip cupidatat
      in incididunt sit veniam. Enim do culpa culpa cupidatat cupidatat esse. In voluptate cillum
      magna duis ex occaecat mollit occaecat occaecat aute nostrud. Id aliqua ut aliqua labore dolor
      cupidatat eiusmod minim velit Lorem magna culpa ex proident. Occaecat voluptate dolore enim
      anim irure ad ex laboris. Do proident magna voluptate non sint. Esse nostrud eiusmod excepteur
      dolor in veniam aliquip.
    </div>
  `,
})
export class SectionCollapse {
  @Input() component = signal<Type<any> | null>(null);
  //@Input() toggle = signal<boolean>(false)

}
