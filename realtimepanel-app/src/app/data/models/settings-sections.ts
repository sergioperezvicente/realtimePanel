import { Type } from "@angular/core";

export interface SettingsSection {
    name: string;
    icon: string;
    component: Type<any>;
    access: boolean | undefined;
}