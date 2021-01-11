type RasiReplacementType = {
  mesham: [string, string[]];
  vrushabham: [string, string[]];
  mithunam: [string, string[]];
  karkatakam: [string, string[]];
  simham: [string, string[]];
  kanya: [string, string[]];
  tula: [string, string[]];
  vrutchikam: [string, string[]];
  danassu: [string, string[]];
  makaram: [string, string[]];
  kumbam: [string, string[]];
  meenam: [string, string[]];
};

const rasiReplacements: RasiReplacementType = {
  mesham: ['&#9800; మేషం', ['అశ్విని', 'భరణి', 'కృత్తిక 1వ పాదం']],
  vrushabham: [
    '&#9801; వృషభం',
    ['కృత్తిక 2,3,4 పాదాలు', 'రోహిణి', 'మృగశిర 1,2 పాదాలు'],
  ],
  mithunam: [
    '&#9802; మిథునం',
    ['మృగశిర 3,4 పాదాలు', 'ఆర్ద్ర', 'పునర్వసు 1,2,3 పాదాలు'],
  ],
  karkatakam: ['&#9803; కర్కాటకం', ['పునర్వసు 4వ పాదం', 'పుష్యమి', 'ఆశ్లేష']],
  simham: ['&#9804; సింహం', ['మఖ', 'పుబ్బ', 'ఉత్తర 1వ పాదం']],
  kanya: ['&#9805; కన్య', ['ఉత్తర 2,3,4 పాదాలు', 'హస్త', 'చిత్త 1,2 పాదాలు']],
  tula: ['&#9806; తుల', ['చిత్త 3,4 పాదాలు', 'స్వాతి', 'విశాఖ 1,2,3 పాదాలు']],
  vrutchikam: ['&#9807; వృశ్చికం', ['విశాఖ 4వ పాదం', 'అనూరాధ', 'జ్యేష్ట']],
  danassu: ['&#9808; ధనుస్సు', ['మూల', 'పూర్వాషాడ', 'ఉత్తరాషాడ 1వ పాదం']],
  makaram: [
    '&#9809; మకరం',
    ['ఉత్తరాషాడ 2,3,4 పాదాలు', 'శ్రవణం', 'ధనిష్ట 1,2 పాదాలు'],
  ],
  kumbam: [
    '&#9810; కుంభం',
    ['ధనిష్ట 3,4 పాదాలు', 'శతభిష', 'పూర్వాభాద్ర 1,2,3 పాదాలు'],
  ],
  meenam: ['&#9811; మీనం', ['పూర్వాభాద్ర 4వ పాదం', 'ఉత్రతరాభాద్ర, రేవతి']],
};

export async function getRasiPhalalu() {
  const sundayMagazinePage = await fetch(
    'https://www.eenadu.net/sundaymagazine'
  ).then((res) => res.text());

  const articleLinkMatch = sundayMagazinePage.match(
    /<a\s*href="https:\/\/www.eenadu.net\/sundaymagazine\/article\/(\d*?)"\s*>రాశిఫలం/i
  );

  if (!articleLinkMatch?.[1]) {
    throw Error('Could not find article link');
  }

  const raasiPhalamUrl = `https://www.eenadu.net/sundaymagazine/article/${articleLinkMatch[1]}`;

  const rasiPhalamArticle = await fetch(raasiPhalamUrl).then((res) =>
    res.text()
  );

  const rasiPhalamContentMatch = rasiPhalamArticle.match(
    /<\/center>([\s\S\n]*?)<center>/i
  );

  if (!rasiPhalamContentMatch) {
    throw Error('Could not find content');
  }

  const parser = new DOMParser();

  const receivedDoc = parser.parseFromString(
    rasiPhalamContentMatch[1],
    'text/html'
  );

  for (const [key, replacementArray] of Object.entries(rasiReplacements)) {
    const element = receivedDoc.querySelector(`img[src*="${key}"]`)
      ?.parentElement;
    if (element?.innerHTML) {
      element.innerHTML = `<div class="rasiHeader"><h2>${
        replacementArray[0]
      }</h2><div class="nakshatramNames">${replacementArray[1]
        .map((rasiCoverage) => `<span>${rasiCoverage}</span>`)
        .join('')}</div></div>`;
    }
  }

  return receivedDoc.body.innerHTML;
}

// https://assets.eenadu.net/article_img/${}

// /<img alt="" src="https:\/\/assets.eenadu.net\/article_img\/\d+RAASI_\d+_\d+.jpg" style="height:90px; width:300px">/
