import * as fs from 'fs';

export function isWindows(): boolean {
	return process.platform === "win32";
}

export function isUnix(): boolean {
	let platform = process.platform;
	return platform === "linux"
		|| platform === "darwin"
		|| platform === "freebsd"
		|| platform === "openbsd";
}

export function isDarwin(): boolean {
	let platform = process.platform;
	return platform === "darwin";
}

export function chmodx(exec:string):void {
	fs.chmodSync(exec, '755');
}

export function isExec(exec:string):boolean {
	if (!isWindows()) {
		try {
			// Check if linux has execution rights
			fs.accessSync(exec, fs.constants.X_OK);
			return true;
		  } catch(ex) {
			  return false
		  }
	}
	return true		
  }

export function javaName():string {
	if(isWindows()) return "java.exe"
	else return "java"
}  