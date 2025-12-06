import React, { useState } from 'react';

// Example 70 rules (simple logic, adapt as needed)
const rules = [
  // Basic
  { label: "At least 8 characters", test: pwd => pwd.length >= 8 },
  { label: "Contains a number", test: pwd => /\d/.test(pwd) },
  { label: "Contains a lowercase letter", test: pwd => /[a-z]/.test(pwd) },
  { label: "Contains an uppercase letter", test: pwd => /[A-Z]/.test(pwd) },
  { label: "Contains a symbol", test: pwd => /[!@#$%^&*()\-_+=]/.test(pwd) },
  { label: "Does not contain 'password'", test: pwd => !pwd.toLowerCase().includes("password") },
  { label: "No more than 2 repeating characters in a row", test: pwd => !/(.)\1\1/.test(pwd) },
  { label: "Does not contain spaces", test: pwd => !/\s/.test(pwd) },
  { label: "Starts with a letter", test: pwd => /^[A-Za-z]/.test(pwd) },
  { label: "Ends with a symbol", test: pwd => /[!@#$%^&*()\-_+=]$/.test(pwd) },
  // Math
  { label: "Sum of all digits is exactly 20", test: pwd => (pwd.match(/\d/g)||[]).map(Number).reduce((a,b)=>a+b,0) === 20 },
  { label: "Contains at least 3 vowels", test: pwd => (pwd.match(/[aeiou]/gi)||[]).length >= 3 },
  { label: "No consecutive vowels", test: pwd => !/[aeiou]{2}/i.test(pwd) },
  { label: "Contains the digit '4'", test: pwd => /4/.test(pwd) },
  { label: "At least 2 uppercase vowels", test: pwd => (pwd.match(/[AEIOU]/g)||[]).length>=2 },
  { label: "Does not contain 'cat'", test: pwd => !pwd.toLowerCase().includes('cat') },
  { label: "Contains either '!' or '@'", test: pwd => /!|@/.test(pwd) },
  { label: "Does not contain more than 3 digits", test: pwd => (pwd.match(/\d/g)||[]).length <= 3 },
  { label: "Contains at least 1 dash '-'", test: pwd => /-/.test(pwd) },
  { label: "Does not contain your name ('neal')", test: pwd => !pwd.toLowerCase().includes('neal') },
  // Misc
  { label: "Does not contain repeated symbols (like '!!')", test: pwd => !/(.)\1/.test(pwd.replace(/[A-Za-z0-9]/g,""))},
  { label: "Contains letter 'Q'", test: pwd => /Q/.test(pwd) },
  { label: "Does not contain '123'", test: pwd => !pwd.includes('123') },
  { label: "Is not a palindrome", test: pwd => pwd !== pwd.split('').reverse().join('') },
  { label: "Contains at least one 'z'", test: pwd => /z/i.test(pwd) },
  { label: "No numbers at the end", test: pwd => !/\d$/.test(pwd) },
  { label: "No underscore '_'", test: pwd => !/_/.test(pwd) },
  { label: "Less than 18 characters", test: pwd => pwd.length < 18 },
  { label: "Does not contain 'dog'", test: pwd => !pwd.toLowerCase().includes('dog') },
  { label: "Contains both 'x' and 'y'", test: pwd => /x/i.test(pwd) && /y/i.test(pwd) },
  { label: "At least 2 different symbols", test: pwd => (pwd.match(/[!@#$%^&*()\-_+=]/g)||[]).filter((v,i,a)=>a.indexOf(v)===i).length>=2 },
  { label: "No more than 2 uppercase letters", test: pwd => (pwd.match(/[A-Z]/g)||[]).length <= 2 },
  { label: "Does not contain sequence 'aaaa'", test: pwd => !/aaaa/i.test(pwd) },
  { label: "Contains 'b' at least once", test: pwd => /b/i.test(pwd) },
  { label: "Contains '7' exactly once", test: pwd => (pwd.match(/7/g)||[]).length === 1 },
  { label: "Contains a period '.'", test: pwd => /\./.test(pwd) },
  { label: "Contains at least 1 non-English letter", test: pwd => /[éöüßç]/i.test(pwd) },
  { label: "Does not contain 'qwerty'", test: pwd => !pwd.toLowerCase().includes('qwerty') },
  { label: "No character used more than 3 times", test: pwd => Array.from(pwd).every(c=>pwd.split(c).length-1<=3) },
  { label: "Does not start with 'a' or 'A'", test: pwd => !/^a/i.test(pwd) },
  // 36-70 -- mostly capricious, fun/difficult!
  ...Array.from({ length: 35 }, (_,i) => ({
    label: `Rule #${i+36}: Must contain unique char '${String.fromCharCode(97+(i%26))}${i}'`,
    test: pwd => pwd.includes(`${String.fromCharCode(97+(i%26))}${i}`)
  }))
];

// Generates a minimalist password. This is a "cheat" at this difficulty!
function generateMinimalPassword(skip35=false) {
  // We'll need to include all unique char requirements if skipping isn't used
  let pwd = "";
  let from = skip35 ? 35 : 0;
  let to = rules.length;
  let forced = "";
  for (let i = from; i < to; ++i) {
    const rule = rules[i];
    // If it's a "Must contain unique char" rule, extract and add that extra char
    if (rule.label.startsWith("Rule #")) {
      const m = rule.label.match(/'(.+)'/);
      if (m) forced += m[1];
    }
  }
  // Try to build a password that passes the global rules and all the specifics
  // We'll combine things to pass most basic checks
  pwd =
    // 8 letters, starts with Q, ends with '!', uppercase/lower/symbol/number/vowel/dash/period/é
    // Use z,y,b,4,7,.,é, -, ! and forced chars
    "Qb4z7-y!.é" + forced;
  // Pad for at least 8 chars if forced requirement is less than expected
  if (pwd.length < 8) pwd += "RJx";
  return pwd;
}

export default function App() {
  const [skip35, setSkip35] = useState(false);
  const [password, setPassword] = useState("");
  const startRule = skip35 ? 35 : 0;

  // Check all rules in the current view
  const ruleChecks = rules.slice(startRule).map(rule => ({
    label: rule.label,
    passed: rule.test(password)
  }));

  // Show minimal password button only if not currently set
  const handleMinimal = () => setPassword(generateMinimalPassword(skip35));

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "40px auto", padding:20 }}>
      <h1 style={{ fontWeight:400, fontSize: "2rem", marginBottom: 20 }}>Password Game with 70 Rules</h1>
      <div style={{marginBottom:20}}>
        <button
          style={{marginRight:10, padding:"8px 16px"}}
          onClick={()=>setSkip35(r=>!r)}
        >
          {skip35 ? "Restart from Rule 1" : "Skip first 35 rules"}
        </button>
        <button
          style={{padding:"8px 16px"}}
          onClick={handleMinimal}
        >
          Auto-Minimal Password
        </button>
      </div>
      <input
        type="text"
        value={password}
        onChange={e=>setPassword(e.target.value)}
        style={{
          fontSize:"1.35rem", padding:"8px", width:"100%", marginBottom:10,
          border: "1px solid #aaa", borderRadius: 4
        }}
        placeholder="Enter your password here..."
      />
      <div style={{marginBottom:22, color:'#888',fontSize:"0.95rem"}}>
        Rules <span style={{fontWeight:600}}>{startRule+1}&ndash;{rules.length}</span> of 70 required
      </div>
      <ul style={{listStyle:'none', padding:0, margin:0}}>
      {ruleChecks.map((r,i) =>
        <li key={i} style={{
          margin: "5px 0",
          color: r.passed ? "#3a5" : "#c33",
          textDecoration: r.passed ? "none":"line-through"
        }}>
          <span style={{
            fontWeight: r.passed ? 700 : 400,
            fontSize:'1.08em',
          }}>
            {r.passed ? "✓" : "✗"} {r.label}
          </span>
        </li>
      )}
      </ul>
      <div style={{
        marginTop:30, background:"#f6f6f6",padding:15,
        borderRadius:6, color:"#888",fontSize:"0.9em"
      }}>
        Done? Your password is: <b style={{color:'#222'}}>{ruleChecks.every(r=>r.passed) ? password : "--"}</b>
      </div>
      <div style={{marginTop:30, color:'#aaa',fontSize:"0.85em"}}>
        Minimalist design, no ads, no distractions 🙂
      </div>
    </div>
  );
}
