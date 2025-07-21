import { ChildProcess } from "node:child_process";

let doctorServerProcess: ChildProcess; // proceso del doctor

export const initDoctorServer = () => {
    if (!doctorServerProcess) {
        doctorServerProcess = {} as ChildProcess;
    }
}
