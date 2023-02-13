const scrape = require('website-scraper');
const getHrefs = require('get-hrefs');
const lineReader = require('line-reader');
var fs = require('fs');
var unique = require('array-unique').immutable;

var readlineSync = require('readline-sync');
  
console.log('What do you want to do?');

var both = false;
var endDelimiter;
var outputFile;

// Wait for user's response.
var action = readlineSync.question('Download: 1 | Convert: 2  => ');
if (action == 1) {
    console.log("Downloading...");
    downloadBank();
} else if (action == 2) {
    var delimiter = readlineSync.question('Marksceme: 1 | No Marksceme: 2 | Both: 3 => ');
    if (delimiter == 2) {
        endDelimiter = '<h2 style="margin-top: 1em">Markscheme</h2>';
        outputFile = './download/';
    } else if (delimiter == 1) {
        endDelimiter = '<h2>Syllabus sections</h2>';
        outputFile = './download/markSceme-';
    } else if (delimiter == 3) {
        both = true;
    } else {
        console.log("You did not enter a valid input...");
        process.exit(1);
    }
    var fileNumber = readlineSync.question('How many pages to convert?  => ');
    if (fileNumber < 1000) {
        console.log("Converting " + fileNumber + " pages...");

        if (both == true) {
            runBoth(fileNumber);
        } else {
            runSeperateQuestions(fileNumber);
        }
} else {
    console.log("That number was too big...");
}
} else {
    console.log("You did not enter a valid input...");
}

async function runBoth(file) {

    endDelimiter = '<h2>Syllabus sections</h2>';
    outputFile = './download/markSceme-';

    await runSeperateQuestions(file, outputFile, endDelimiter);
    previousCodes = [];

    endDelimiter = '<h2 style="margin-top: 1em">Markscheme</h2>';
    outputFile = './download/';

    await runSeperateQuestions(file, outputFile, endDelimiter);
    previousCodes = [];

}

async function downloadBank() {

    await getLinks('IBQ.htm');

    var urls = getHrefs(output);
    var uniqueUrls = unique(urls);
    
    const options = {
      urls: uniqueUrls,
      directory: './download',
    };
     
    // with async/await
    scrape(options).then((result) => {

    });
}

async function runSeperateQuestions(file, outputName, end) {


    var head = fs.readFileSync('./head.html', 'utf8');

    fs.writeFileSync(outputFile + 'SL-paper1.html', head + '<h2>SL Paper 1</h2>');
    fs.writeFileSync(outputFile + 'SL-paper2.html', head + '<h2>SL Paper 2</h2>');
    fs.writeFileSync(outputFile + 'SL-paper3.html', head + '<h2>SL Paper 3</h2>');
    fs.writeFileSync(outputFile + 'HL-paper1.html', head + '<h2>HL Paper 1</h2>');
    fs.writeFileSync(outputFile + 'HL-paper2.html', head + '<h2>HL Paper 2</h2>');
    fs.writeFileSync(outputFile + 'HL-paper3.html', head + '<h2>HL Paper 3</h2>');      

    await getQuestion('./download/index.html');
    for (let i = 1; i <= fileNumber; i++) {
        console.log("Parsing index_"+i+".html");
        
        await getQuestion('./download/index_'+i+'.html');
    }
}
var previousCodes = [];
function getQuestion(file) {
    var paper = 1;
    var readPaper = false;
    var level = 'sl';
    var reading = false;
    var code = false;
    var done = false;
    return new Promise((resolve, reject) => {
    lineReader.eachLine(file, function(line, last, cb) {
        if (done == true) {
            cb(false);
        } else {
            cb();
        }
        if (line.includes(endDelimiter)) {
            reading = false;
            if (level == 'sl') {
                if (paper == 1) {
                    fs.appendFileSync(outputFile + 'SL-paper1.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                    
                }
                if (paper == 2) {
                    fs.appendFileSync(outputFile + 'SL-paper2.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
                if (paper == 3) {
                    fs.appendFileSync(outputFile + 'SL-paper3.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
            } else if (level == 'hl') {
                if (paper == 1) {
                    fs.appendFileSync(outputFile + 'HL-paper1.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
                if (paper == 2) {
                    fs.appendFileSync(outputFile + 'HL-paper2.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
                if (paper == 3) {
                    fs.appendFileSync(outputFile + 'HL-paper3.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
            } else if (level == 'both') {
                if (paper == 1) {
                    fs.appendFileSync(outputFile + 'HL-paper1.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
                if (paper == 2) {
                    fs.appendFileSync(outputFile + 'HL-paper2.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
                if (paper == 3) {
                    fs.appendFileSync(outputFile + 'HL-paper3.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
                if (paper == 1) {
                    fs.appendFileSync(outputFile + 'SL-paper1.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                    
                }
                if (paper == 2) {
                    fs.appendFileSync(outputFile + 'SL-paper2.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
                if (paper == 3) {
                    fs.appendFileSync(outputFile + 'SL-paper3.html', "<br><hr><br>");
                    console.log("Writing Finished.");
                }
            }
            done = true;
        }
        if (reading == true) {
            if (level == 'hl') {
                if (paper == 1) {
                    fs.appendFileSync(outputFile + 'HL-paper1.html', line + '\r\n');
                }
                if (paper == 2) {
                    fs.appendFileSync(outputFile + 'HL-paper2.html', line + '\r\n');
                }
                if (paper == 3) {
                    fs.appendFileSync(outputFile + 'HL-paper3.html', line + '\r\n');
                }
            } else if (level == 'sl') {
                if (paper == 1) {
                    fs.appendFileSync(outputFile + 'SL-paper1.html', line + '\r\n');
                }
                if (paper == 2) {
                    fs.appendFileSync(outputFile + 'SL-paper2.html', line + '\r\n');
                }
                if (paper == 3) {
                    fs.appendFileSync(outputFile + 'SL-paper3.html', line + '\r\n');
                }   
            } else if (level == 'both') {
                if (paper == 1) {
                    fs.appendFileSync(outputFile + 'SL-paper1.html', line + '\r\n');
                }
                if (paper == 2) {
                    fs.appendFileSync(outputFile + 'SL-paper2.html', line + '\r\n');
                }
                if (paper == 3) {
                    fs.appendFileSync(outputFile + 'SL-paper3.html', line + '\r\n');
                }   
                if (paper == 1) {
                    fs.appendFileSync(outputFile + 'HL-paper1.html', line + '\r\n');
                }
                if (paper == 2) {
                    fs.appendFileSync(outputFile + 'HL-paper2.html', line + '\r\n');
                }
                if (paper == 3) {
                    fs.appendFileSync(outputFile + 'HL-paper3.html', line + '\r\n');
                }
            }
        }
        if (code == true) {
            console.log(previousCodes.indexOf(line));
            
            if (previousCodes.indexOf(line) == -1) {
                previousCodes.push(line);
            } else {
                console.log("Repeat!");
                code = false;
                done = true;
            }
            code = false;
        }
        if (line.includes('<td class="info_label">Paper</td>')) {
            readPaper = true;
        } else if (readPaper == true) {
           paper = line.match(/\d+/)[0]
           readPaper = false;
        } 
        if (line.includes('<td class="info_value">Higher level</td>')) {
            level = 'hl';
        } else if (line.includes('<td class="info_value">Standard level</td>')) {
            level = 'sl';
        }
        if (line.includes('<td class="info_value">HL</td>')) {
            level = 'hl';
        } else if (line.includes('<td class="info_value">SL</td>')) {
            level = 'sl';
        }
        else if (line.includes('<td class="info_value">SL and HL</td>')) {
            level = 'both';
        }
        if (line.includes('<h2>Question</h2>')) {
            reading = true;
            console.log("Writing...");
        }
        if (line.includes('<td class="info_label">Reference code</td>')) {
            code = true;
        }
    }, function finished (err) {
        if (err) return reject(err);
        resolve();
        console.log("Finished question!");
        return true;
      });
    });
}

var output;
function getLinks(file) {
    var paper = 1;
    var level = 'sl';
    var reading = false;
    var code = false;
    var done = false;
    return new Promise((resolve, reject) => {
    lineReader.eachLine(file, function(line, last, cb) {
        if (done == true) {
            cb(false);
        } else {
            cb();
        }
        if (line.includes('<div class="footer">')) {
            reading = false;
            done = true;
        }
        if (reading == true) {
          output += line;  
        }
        if (line.includes('<h3>Directly related questions</h3>')) {
            reading = true;
            console.log("Reading...");
        }
    }, function finished (err) {
        if (err) return reject(err);
        resolve();
        console.log("Finished links!");
        return true;
      });
    });
}
