#!/usr/bin/env node

var chalk = require('chalk');
var fs = require('fs');

const pbList = ['c098e5700048', 'c098e570004a', 'c098e570004e', 'c098e5700053', 'c098e570013c'];
const configList = ['jumper', 'outlet', 'surge'];

function printDevice(device, missing) {
	var misCount = 0;
	var printString = chalk.bold.white(device + "\t\tJumper\t\tOutlet\t\tSurge\n");
	//console.log(chalk.bold.white(device + "\t\tJumper\t\tOutlet\t\tSurge"));
	if(file_info[device]['actual']) {
		if(typeof file_info[device]['actual'] == "number") {
			if(missing == false) {
				printString += chalk.bold.white("Actual: ") + chalk.green(file_info[device]['actual'].toFixed(1)) + "\n";
				//console.log(chalk.bold.white("Actual: ") + chalk.green(file_info[device]['actual'].toFixed(1)));
			}
		}
		else {
			var string = chalk.bold.white("Actual:\t\t");
			var locMis = 0;
			for(var j = 0; j < configList.length; j++) {
				if(file_info[device]['actual'][configList[j]]) {
					if(file_info[device]['actual'][configList[j]] == -1) {
						string += chalk.yellow("Incomplete\t");
						locMis += 1;
					}
					else if(file_info[device]['actual'][configList[j]] == -2) {
						string += chalk.grey("--\t\t");
					}
					else {
						string += chalk.green(file_info[device]['actual'][configList[j]].toFixed(1)) + "\t\t";
					}
				}
				else {
					string += chalk.bold.red("Missing") + "\t\t";
					locMis += 1;
				}
			}
			if(missing == false || locMis > 0) {
				printString += string + "\n";
				misCount += locMis;
				//console.log(string);
			}
		}
	}
	else {
		printString += chalk.bold.white("Actual: ") + chalk.bold.red("Missing\n")
		misCount += 1;
		//console.log(chalk.bold.white("Actual: ") + chalk.bold.red("Missing"))
	}

	for (var i = 0; i < pbList.length; i++) {
		var pb = pbList[i];
		var string = chalk.bold.white(pb) + "\t";
		var locMis = 0;

		for (var j = 0; j < configList.length; j++) {
			config = configList[j];

			if(file_info[device][pb] && file_info[device][pb][config]) {
				if(file_info[device][pb][config] == -1) {
					string += chalk.yellow("Incomplete\t");
					locMis += 1;
				}
				else if(file_info[device][pb][config] == -2) {
					string += chalk.grey("--\t\t");
				}
				else {
					string += chalk.green(file_info[device][pb][config].toFixed(1)) + "\t\t";
				}
			}
			else {
				string += chalk.bold.red("Missing") + "\t\t";
				locMis += 1;
			}
		}
		if(missing == false || locMis > 0) {
			printString += string + "\n";
			misCount += locMis;
			//console.log(string);
		}
	}
	if(missing == false || misCount > 0) {
		console.log(printString);
	}
}

// Get device in question
var device_save = "";
var device_clear = "";
if(process.argv.length >= 3) {
	device_save = process.argv[2];
	if(process.argv.length == 4) {
		device_clear = process.argv[3];
	}
}
    
file_info = {}

var filenames = fs.readdirSync(process.env.PB_DATA);

filenames.forEach( function(file) {

	var shortname = file.split('.')[0], extension = file.split('.')[1];
	if(extension == "dat" || extension == "txt") {
		//console.log(shortname);
		filelist = shortname.split('_');

		if(filelist.length >= 1 && filelist.length <= 3) {
			var data = fs.readFileSync(process.env.PB_DATA + "/" + file, 'utf8');
			var avgPower = 0;
			var countPower = 0;
			var readLines = data.split('\n');
			for (var i = 0; i < readLines.length; i++) {
				try {
					//console.log(readLines[i])
					//console.log(JSON.parse(readLines[i]))
					avgPower += parseFloat(JSON.parse(readLines[i])['power']);
					countPower += 1;
				} catch (e) {
					if(e != "SyntaxError: Unexpected end of input" && e != "SyntaxError: Unexpected end of JSON input") {
						console.log(e);
					}
				}
				//console.log(avgPower);
			}
		}

		if(filelist.length == 3) {
			//console.log(filelist);
			var device = filelist[1];
			var pb = filelist[0];
			var config = filelist[2];

			if(!file_info[device]) {
				file_info[device] = {};
			}
			if(!file_info[device][pb]) {
				file_info[device][pb] = {};
			}
			if(!file_info[device][pb][config]) {
				if(countPower == 0) {
					file_info[device][pb][config] = -2;
				}
				else if(countPower == 50) {
					file_info[device][pb][config] = avgPower / countPower;
				}
				else {
					file_info[device][pb][config] = -1;
				}
			}
			else {
				console.log("Error: repeat configuration: " + device + ", " + pb + ", " + config);
			process.exit();
			}
		}
		else if(filelist.length == 2) {
			var device = filelist[0];
			var config = filelist[1];
			if(!file_info[device]) {
				file_info[device] = {};
			}
			if(!file_info[device]['actual']) {
				file_info[device]['actual'] = {};
			}
			else if(typeof file_info[device]['actual'] == "number") {
				console.log("Error: inconsistent ground truth: " + device);
				process.exit();
			}
			if(!file_info[device]['actual'][config]) {
				if(countPower == 0) {
					file_info[device]['actual'][config] = -2;
				}
				else if(countPower == 10) {
					file_info[device]['actual'][config] = avgPower / countPower;
				}
				else {
					file_info[device]['actual'][config] = -1;
				}
			}
			else {
				console.log("Error: repeat ground truth: " + device);
				process.exit();
			}
		}
		else if(filelist.length == 1) {
			var device = filelist[0];
			if(!file_info[device]) {
				file_info[device] = {};
			}
			if(!file_info[device]['actual']) {
				file_info[device]['actual'] = avgPower / countPower;
			}
			else {
				console.log("Error: repeat ground truth: " + device);	
				process.exit();
			}
		}
	}
});

console.log();
console.log("Data checkup for PowerBlade measurements");
console.log();

var missing = false;
if(device_save == "missing") {
	device_save = "";
	missing = true;
}

if(device_save == "clear") {
	for(var i = 0; i < configList.length; i++) {
		if(file_info[device_clear]['actual'] && typeof file_info[device_clear]['actual'] != "number" && !file_info[device_clear]['actual'][configList[i]]) {
			var filename = process.env.PB_DATA + "/" + device_clear + "_" + configList[i] + ".dat";
			console.log("Creating file: " + filename);
			fs.closeSync(fs.openSync(filename, 'w')); 
		}

		for(var j = 0; j < pbList.length; j++) {
			if(!file_info[device_clear][pbList[j]] || !file_info[device_clear][pbList[j]][configList[i]]) {
				var filename = process.env.PB_DATA + "/" + pbList[j] + "_" + device_clear + "_" + configList[i] + ".dat";
				console.log("Creating file: " + filename);
				fs.closeSync(fs.openSync(filename, 'w')); 
			}
		}
	}
	process.exit();
}

if(device_save == "") {
	for(var device in file_info) {
		printDevice(device, missing);
	}
}
else {
	printDevice(device_save, missing);
}

// For each device, find the maximum difference between any two measurements
for(device in file_info) {
	var maxVal = 0;
	var minVal = 2500;
	var maxPb, maxConfig;
	var minPb, minConfig;
	var average = 0;
	var avcount = 0;
	for(pb in pbList) {
		for(config in configList) {
			if(file_info[device][pbList[pb]][configList[config]] != -1 && file_info[device][pbList[pb]][configList[config]] != -2) {
				average += file_info[device][pbList[pb]][configList[config]];
				avcount += 1;

				if(file_info[device][pbList[pb]][configList[config]] < minVal) {
					minVal = file_info[device][pbList[pb]][configList[config]];
					minPb = pbList[pb];
					minConfig = configList[config];
				}
				if(file_info[device][pbList[pb]][configList[config]] > maxVal) {
					maxVal = file_info[device][pbList[pb]][configList[config]];
					maxPb = pbList[pb];
					maxConfig = configList[config];
				}
			}
		}
	}
	//console.log(device + "\t" + maxVal + "\t" + minVal)
	// Actuall calculate maximum
	file_info[device]['maxDiff'] = maxVal - minVal;
	file_info[device]['average'] = average / avcount;
}

var file_copy = JSON.parse(JSON.stringify(file_info));

var writeString_power = "";

//console.log(file_copy['vac'])

// Output the maxDiff data, sorted by maximum difference
for(burner in file_info) {	// Do this for the number of devices
	var maxVal = 0;
	var maxDevice;
	for(device in file_copy) {	// For any device not yet printed
		if(file_copy[device]['maxDiff'] > maxVal) {
			maxVal = file_copy[device]['maxDiff'];
			maxDevice = device;
		}
	}
	writeString_power += maxDevice + "\t" + maxVal + "\t" + maxVal/file_copy[maxDevice]['average'] + "\n";
	delete file_copy[maxDevice];
}

fs.writeFileSync("sorted_maxDiff_power.dat", writeString_power);







