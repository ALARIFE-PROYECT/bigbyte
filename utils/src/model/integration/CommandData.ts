import { Addon } from "./Addon";
import { Command } from "./Command";
import { Dependency } from "./Dependency";
import { FlagData } from "./Flag";
import { MainFile } from "./MainFile";

export interface CommandData {
    mainFile?: MainFile;
    command: Command;
    flagsData: FlagData[];
    environmentValues: Map<string, string>;
    envDefaultValues: Map<string, string>;
    dependencies: Dependency[];
    addons: Addon[];
    commands: Command[];
}