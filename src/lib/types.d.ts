declare module "react-quirk" {
    import {Quirk, QuirkConfig} from "./quirk";
    import {QuirkStateConfig} from "./hooks/useQuirkState";

    function quirk(config: QuirkConfig): Quirk

    function useQuirkState(quirk: Quirk, config: QuirkStateConfig): any
    export = { quirk, useQuirkState}
}