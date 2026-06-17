const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

exports.executeCode = async (req, res) => {
  try {
    const { code } = req.body;

    const filePath = path.join(
      __dirname,
      "../temp/main.py"
    );

    fs.writeFileSync(
      filePath,
      code
    );

    const dockerCommand =
      `docker run --rm ` +
      `-v "${filePath}:/app/main.py" ` +
      `python:3.11-slim ` +
      `python /app/main.py`;

    exec(
      dockerCommand,
      (error, stdout, stderr) => {
        if (error) {
          return res.json({
            output:
              stderr ||
              error.message,
          });
        }

        res.json({
          output: stdout,
        });
      }
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      output:
        "Execution Error",
    });
  }
};