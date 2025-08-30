  
    const linkedin = [
      "arpita-karmakar",
      "isamiranmondal",
      "babanmahatonca",
      "krishna-gope-nca",
      "thequeen",
      "rubi-mondal-5691b92a4",
      "manoj-maji-430151277",
      "om-prakash-thakur-6b10bb368",
      "ujjal-mahato-a799a0342"
    ];

    const telegram = [
      "raniroy_nca",
      "krishnanca",
      "ujjal_mahato",
      "babanmahatonca",
      "om_prakashthakur",
      "arpita_nca",
      "i_manojmaji",
      "rubi_nca",
      "samiranmondal"
    ];

    const emails = [
      'krishnagope.nca@gmail.com',
      'krishna.mediaxwire@gmail.com',

      'babanmahato.nca@gmail.com',
      'baban.mediaxwire@gmail.com',
      'baban.pressefy@gmail.com',

      'omprakash.newscoverage.agency@gmail.com',
      'omprakash.mediaxwire@gmail.com',
      'omprakashpressefy@gmail.com',

      'ujjalpressefy@gmail.com',
      'umm.prs@gmail.com',
      'umn.prs@gmail.com',

      'arpitakarmakar@newscoverage.agency',
      'babanmahato@newscoverage.agency',
      'krishnagope@newscoverage.agency',

      'touch@newscoverage.agency',

      'manojmaji.sprs.m@gmail.com',
      'manojmaji.sprs.n@gmail.com',
      'manojpressefy@gmail.com',

      'samiranmondal@newscoverage.agency',

      'newscoverage.agency@gmail.com',
      'pressefyindia@gmail.com',

      'rubimondal.nca@gmail.com',
      'pressefy.rubi@gmail.com',
    ].map((e) => e.toLowerCase());

    function normalizeInput(value, type) {
      let norm = value.trim().toLowerCase();

      if (type === "linkedin") {
        norm = norm.replace("https://www.linkedin.com/in/", "")
                   .replace("https://linkedin.com/in/", "")
                   .replace(/\/$/, "");
      } else if (type === "telegram") {
        norm = norm.replace("https://t.me/", "")
                   .replace("@", "")
                   .replace(/\/$/, "");
      } else if (type === "email") {
        norm = norm.replace(/\/$/, "");
      }
      return norm;
    }

    function verify() {
      const type = document.getElementById("type").value;
      const input = document.getElementById("input").value;
      const norm = normalizeInput(input, type);

      let found = false;
      if (type === "linkedin" && linkedin.includes(norm)) found = true;
      if (type === "telegram" && telegram.includes(norm)) found = true;
      if (type === "email" && emails.includes(norm)) found = true;

      const resultDiv = document.getElementById("result");
      if (found) {
        resultDiv.innerHTML = "✅ Verified part of our team. Thank you.";
        resultDiv.className = "result success";
      } else {
        resultDiv.innerHTML = "❌ Not Found in Team.";
        resultDiv.className = "result fail";
      }
    }

    function toggleButton() {
      const input = document.getElementById("input").value.trim();
      const btn = document.getElementById("searchBtn");
      btn.disabled = input.length === 0;
    }
  
