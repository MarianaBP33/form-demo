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
    var queryData = '1-Is the candidate fit for the position("yes","no","maybe"). 2-According to the position described rate the candidate skills as novice, intermidiate, advanced or expert, like for example:Java - advanced, all in one line. 3 - provide list of other skills with rating(novice,intermidiate,advanced,expert) aswell,all in one line. 4 - generate summary, 5 - When is the candidate ready to start project, 6 - what is the candidate looking for, 7-generate comments to the checked skills... different line for each number';
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

            if (textArr[2]) {
          let skillsStr = textArr[2].substring(textArr[2].indexOf("-")+1);
        let skillsArr = skillsStr.split(','); // update here: skills are separated by comma
        
            skillsArr.forEach(skillStr => {
            let skillRatingArr = skillStr.split('-');
            let skillName = skillRatingArr[0].trim().toLowerCase();
            let skillRating = skillRatingArr[1].trim().toLowerCase();

            // Create a new skill badge
            let skillBadge = document.createElement('span');
            skillBadge.className = "inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium border border-gray-800 text-gray-800 dark:border-neutral-200 dark:text-black";
            skillBadge.textContent = `${skillName.charAt(0).toUpperCase() + skillName.slice(1)} - ${skillRating.charAt(0).toUpperCase() + skillRating.slice(1)}`;

            // Append the badge to the skills div
            document.querySelector('.skills').appendChild(skillBadge);
        });
        }
        
              if (textArr[3]) {
          let skillsStr = textArr[3].substring(textArr[3].indexOf("-")+1);
        let skillsArr = skillsStr.split(','); // update here: skills are separated by comma
        
            skillsArr.forEach(skillStr => {
            let skillRatingArr = skillStr.split('-');
            let skillName = skillRatingArr[0].trim().toLowerCase();
            let skillRating = skillRatingArr[1].trim().toLowerCase();

            // Create a new skill badge
            let skillBadge = document.createElement('span');
            skillBadge.className = "inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium border border-gray-800 text-gray-800 dark:border-neutral-200 dark:text-black";
            skillBadge.textContent = `${skillName.charAt(0).toUpperCase() + skillName.slice(1)} - ${skillRating.charAt(0).toUpperCase() + skillRating.slice(1)}`;

            // Append the badge to the skills div
            document.querySelector('.skills2').appendChild(skillBadge);
        });
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