const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
var Busboy = require('busboy');
var wavSpectro = require('wav-spectrogram');
const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    
}));



//add other middleware
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// upoad single file
app.post('/upload-noisy-clip', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let input_file = req.files.inputFile;
            let canvasElem = req.files.text;

            console.log(input_file.name);
            var reader = new FileReader();
            console.log(input_file.name);
            reader.onload = function() {
                console.log(input_file.name);

    var arrayBuffer = reader.result;

    wavSpectro.drawSpectrogram({arrayBuffer: arrayBuffer, canvasElem: canvasElem, cmap: 'jet'}, function () {
    
        console.log("Done.");
    
    });

};

reader.readAsArrayBuffer(fileInput.files[0]);
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            if (input_file.size<5 * 1024 * 1024 * 1024) {
            input_file.mv('./uploads/' + input_file.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: input_file.name,
                    mimetype: input_file.mimetype,
                    size: input_file.size
                }
            });
        }else{

            res.send({
                status: false,
                message: 'Maximum size is 2mb',
                data: {
                    name: input_file.name,
                    mimetype: input_file.mimetype,
                    size: input_file.size
                }
            });
        }
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// upload multiple files
app.post('/upload-photos', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
    
            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];
                
                //move photo to upload directory
                photo.mv('localhost:5000/uploads/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//make uploads directory static
app.use(express.static('uploads'));

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);