const view = new StudentGradesViewModel();

function reformatData(data, sectionSelection) {
    const selectedData = data.result[sectionSelection];

    const student = selectedData.students[0];

    const categories = selectedData.categories.map(c => {
        return { id: c.id, weight: c.weight, name: c.name }
    });
    const assignments = selectedData.items.map(i => {
        return {
            id: i.id,
            categoryId: i.categoryId,
            maxScore: i.maxScore,
            extraCredit: i.isExtraCredit,
            points: i.points,
            name: i.name
        }
    });
    const grades = student.gradedEntries.map(g => {
        return {
            assignmentId: g.itemId,
            userId: g.userId,
            grade: g.rawScore
        }
    });
    const scoreCodes = selectedData.scoreCodes;

    return [{ userId: student.id }, categories, assignments, grades, scoreCodes];
}

function applyData(data) {
    const formatedData = reformatData(data, 0);
    view.init(formatedData[0], formatedData[1], formatedData[2], formatedData[3], formatedData[4]);
}

async function loadServerData(url) {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

loadServerData('data.json').then(applyData);

ko.applyBindings(view, document.querySelector('#tables'));
