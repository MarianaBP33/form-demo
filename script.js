const splitTextIntoSegments = (text) => {
    const lines = text.split("\n");
    const segments = [];
    let currentSegment = "";

    lines.forEach((line, i) => {
        const isSkillLine = line.includes("-");
        
        if (isSkillLine && currentSegment) {
            segments.push(currentSegment);
            currentSegment = line;
        } else {
            currentSegment = `${currentSegment}\n${line}`;
        }

        if (i === lines.length - 1) {
            segments.push(currentSegment);
        }
    });

    return segments.map(segment => segment.trim());
}

document.querySelector('input[type="file"]').addEventListener('change', function(event) {
    var audioFile = event.target.files[0];
    console.log(audioFile);
});

document.getElementById('submitBtn').addEventListener('click', function () {
    event.preventDefault();
    
    var audioFile = document.querySelector('input[type="file"]').files[0];
    var queryData = '1-Is the candidate fit for the position("yes","no","maybe"). 2-According to the position described rate the candidate skills as novice, intermidiate, advanced or expert. as a list like for example:Java - advanced. 3 - provide list of other skills with rating(novice,intermidiate,advanced,expert) aswell, 4 - generate summary, 5 - When is the candidate ready to start project, 6 - what is the candidate looking for, 7-generate comments to the checked skills';
    var formData = new FormData();
    formData.append('audio', audioFile);  
    formData.append('query', queryData);
    
    axios.post('http://localhost:3000/api/audio/transcription', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(function(response) {
        var data = response.data.text;
        console.log(data);
        let textArr = splitTextIntoSegments(data);

        if (textArr[1].toLowerCase().includes("yes")) {
            document.getElementById('option1').checked = true;
        } else if (textArr[1].toLowerCase().includes("no")) {
            document.getElementById('option2').checked = true;
        } else if (textArr[1].toLowerCase().includes("maybe")) {
            document.getElementById('option3').checked = true;
        }

        if (textArr[4]) {
            document.getElementById('summary').value = textArr[4].substring(textArr[4].indexOf("-") + 2);
        }

        if (textArr[5]) {
            document.getElementById('enterProject').value = textArr[5].substring(textArr[5].indexOf("-") + 2);
        }

        if (textArr[6]) {
            document.getElementById('lookingFor').value = textArr[6].substring(textArr[6].indexOf("-") + 2);
        }

        if (textArr[7]) {
            document.getElementById('comments').value = textArr[7].substring(textArr[7].indexOf("-") + 2);
        }

        console.log(response.data);
        
    })
    .catch(function(error) {
        console.error(error);
    });
    
});