import * as shell from "shelljs";

shell.cp("src/config/adds.json", "dist-back/config/");
shell.cp("src/config/jobState.json", "dist-back/config/");