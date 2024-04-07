// const util = require('util');
const readline = require('readline').promises;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// const question = util.promisify(rl.question.bind(rl));

function showTheClaw() {
    const theClaw = `
        ______________________
       /|  /                 /|
      /---/-----------------/ |
     /__|/|________________/  |
     |  | |                |  |
     |  | |                |  |
     |  |(|)               |  |
     |  | _________________|__|
     |  / .    .        .  |  /\\
     | /____.    .   .    .| /y |
     |/____/____x__________|/   |
    /                       \\   |
    |     ___   ___   ___   |   |
    | || |_1_| |_2_| |_3_|  |   |
    |                       |   |
    |                       |   |
    |        _______        |   |
    |       |       |       |   |
    |       |_______|       |   |
    |                       |   /
    |                       |  /
    |                       | /
    |_______________________|/
    `;

    console.log(theClaw);
}

function showInstruction() {
    console.log("1. insert a coin");
    console.log("2. press button 1 to move the claw x position");
    console.log("3. press button 2 to move the claw y position");
    console.log("4. press button 3 to let the claw grab the prize");
    console.log("5. the claw will then return to its original position and drop the prize!\n")
}

function welcomeUser() {
    showTheClaw();
    console.log("\nWelcome to The CLAW!\n\nPlease read the following instruction:");
    showInstruction();
}

function farewell() {
    console.log("\nSad to see you go! Bye!\n");
}

function generatePrizePos(horSize, verSize) {
    return {
        x: Math.floor(Math.random() * horSize),
        y: Math.floor(Math.random() * verSize),
    };
}

function getValidInput(input) {
    const pattern = /^[1-5]$/;
    const matched = input.match(pattern);
    if (!matched) {
        return null;
    }
    return matched[0];
}

async function getInput() {
    console.log("\nWhat are you gonna do?")
    console.log("1. insert a coin");
    console.log("2. move the claw x position");
    console.log("3. move the claw y position");
    console.log("4. lower the claw to grab the prize");
    console.log("5. leave the claw alone")

    let action = null;
    while (true) {
        try {
            const input = await rl.question("Choose a number (1-5): ");
            const validInput = getValidInput(input);
            if (validInput) {
                action = parseInt(validInput, 10);
                break;
            }
            console.log("Invalid input!\n");
        } catch (error) {
            console.log("ERROR! ", error);
            break;
        }
    }
    return action;
}

function getMoveButtonValidInput(input) {
    const pattern = /^\d+$/;
    const matched = input.match(pattern);
    if (!matched) {
        return null;
    }
    return matched[0];
}

async function getMoveButtonInput(maxVal) {
    let newPos = null;
    while (true) {
        try {
            const input = await rl.question(`Move claw position how far? (0-${maxVal}): `);
            const validInput = getMoveButtonValidInput(input);
            if (!validInput) {
                console.log("Invalid input!");
                continue;
            }
            const val = parseInt(validInput, 10);
            if (val < 0) {
                console.log("Cannot move claw to < 0!");
                continue;
            }
            if (val > maxVal) {
                console.log("Cannot move claw to > ", maxVal, "!");
                continue;
            }
            newPos = val;
            break;
        } catch (error) {
            console.log("ERROR! ", error);
            break;
        }
    }

    return newPos;
}

function generatePrizes(num = 10, horSize = 100, verSize = 100) {
    const prizes = [];
    const checkMap = {};
    for (let i = 0; i < num; i++ ) {
        let prize = generatePrizePos(horSize, verSize);
        while (checkMap[prize.x] && checkMap[prize.x] == prize.y) {
            prize = generatePrizePos(horSize, verSize);
        }
        checkMap[prize.x] = prize.y;
        prizes.push(prize);
    }
    return prizes;
}

function getThePrize(prizes, x, y) {
    for (let prize in prizes) {
        if (prize.x === x && prize.y === y) {
            return "Stuffed Pikachu";
        }
    }
    return null;
}

async function start() {
    let isFinished = false;

    let isCoinInserted = false;
    
    let xPos = null;
    let yPos = null;

    const numberOfPrizes = 10;
    const maxXPos = 50;
    const maxYPos = 50;
    const prizes = generatePrizes(numberOfPrizes, maxXPos, maxYPos);

    welcomeUser();

    while (!isFinished) {
        const input = await getInput();

        if (input === 1) {
            if (isCoinInserted) {
                console.log("\nCoin is already inserted!")
                continue;
            }

            isCoinInserted = true;
            console.log("\nCoin is inserted! Thank you very much!")
            continue;
        }

        if (input === 2) {
            if (!isCoinInserted) {
                console.log("\nPlease insert a coin first!");
                continue;
            }

            const currentVal = await getMoveButtonInput(maxXPos);
            if (xPos === null) {
                xPos = currentVal;
                continue;
            }
            if (xPos < currentVal) {
                console.log("Cannot move back the claw!");
                continue;
            }

            xPos = currentVal;
            continue;
        }

        if (input === 3) {
            if (!isCoinInserted) {
                console.log("\nPlease insert a coin first!");
                continue;
            }

            if (xPos === null) {
                console.log("\nPlease move claw x position first!");
                continue;
            }

            const currentVal = await getMoveButtonInput(maxYPos);
            if (yPos === null) {
                yPos = currentVal;
                continue;
            }

            if (currentVal < yPos) {
                console.log("\nCannot move back the claw!!");
                continue;
            }

            yPos = currentVal;
            continue;
        }

        if (input === 4) {
            if (!isCoinInserted) {
                console.log("\nPlease insert a coin first!");
                continue;
            }

            if (xPos === null) {
                console.log("\nPlease move claw x position first!");
                continue;
            }

            if (yPos === null) {
                console.log("\nPlease move claw y position first!");
                continue;
            }

            const prize = getThePrize(prizes, xPos, yPos);

            if (!prize) {
                console.log("\nYou got nothing! Good luck next time!");
            } else {
                console.log("\nCongratz! You won a ", prize, "!!!");
            }

            isCoinInserted = false;
            continue;
        }

        if (input === 5) {
            farewell();
            isFinished = true;
            rl.close();
            break;
        }
    }

    process.exit();
}

start();