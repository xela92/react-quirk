
declare module "react-quirk" {
    import {Quirk} from "./quirk";

    function quirk(config: QuirkConfig): Quirk

    function useQuirkState(quirk: Quirk, config: QuirkStateConfig): any
    export = { quirk, useQuirkState}
}