import { Emiter } from "@skedo/utils";
import { ComponentMetaConfig, ComponentMeta, Topic } from "@skedo/meta";
/**
 * 元数据的Repository
 */
export declare class ComponentsLoader extends Emiter<Topic> {
    private static inst;
    static defaultProps: ComponentMetaConfig;
    state: number;
    list: Array<ComponentMeta>;
    loadByName(group: string, name: string): ComponentMeta;
    static get(): ComponentsLoader;
    private loadRemote;
    load(): Promise<void>;
}
