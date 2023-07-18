// SPDX-License-Identifier: MIT
// Copyright © 2023 André Santos

// -----------------------------------------------------------------------------
//  Constants
// -----------------------------------------------------------------------------

const { createApp } = Vue;

const PROPERTY_KEYWORDS = [
  /(^|\s)(globally)(\s*:)/ig,
  /(^|\s)(after)(\s+\S)/ig,
  /(^|\s)(until)(\s+\S)/ig,
  /(:\s*)(no)(\s)/ig,
  /(:\s*)(some)(\s)/ig,
  /(\S\s+)(causes)(\s+\S)/ig,
  /(\S\s+)(requires)(\s+\S)/ig,
  /(\S\s+)(forbids)(\s+\S)/ig,
  /(\S\s+)(or)(\s+\S)/ig,
  /(\S\s+)(within)(\s+\d)/ig,
  /(\d\s*)(s)(\s|$)/ig,
  /(\d\s*)(ms)(\s|$)/ig,
];

const PREDICATE_KEYWORDS = [
  /(\W)(not)(\s)/ig,
  /(\s)(and)(\s)/ig,
  /(\s)(or)(\s)/ig,
  /(\s)(implies)(\s)/ig,
  /(\s)(in)(\s)/ig,
];

const PREDICATE_REGEX = /(\S\s*)(\{.*?\})/g;
const CHANNEL_REGEX = /(:|\s)([a-zA-Z_\-/$#?][\w-/$#?]*)(\s|\{|$)/g;
const NUMBER_REGEX = /(\D)(\d*\.?\d+)(\D)/g;
const STRING_REGEX = /("(?:\\?[\S\s])*?")/g;
const BOOLEAN_REGEX = /(\W)(true|false)(\W)/ig;

// -----------------------------------------------------------------------------
//  Components
// -----------------------------------------------------------------------------

const RuntimeMonitor = {
  template: "#vue-runtime-monitor",

  props: {
    name: String,
    property: String,
  },

  computed: {
    propertyHTML() {
      // replace predicates with placeholders
      let p = this.property.replace(PREDICATE_REGEX, "$1{}");
      // bolden keywords in the scope and pattern structures
      for (const re of PROPERTY_KEYWORDS) {
        p = p.replace(re, "$1<b>$2</b>$3");
      }
      // colorize channel names
      p = p.replace(CHANNEL_REGEX, '$1<span class="special">$2</span>$3');
      // handle predicates
      const matches = [...this.property.matchAll(PREDICATE_REGEX)];
      for (const match of matches) {
        let predicate = match[2];
        // replace strings with placeholders
        const strings = [...predicate.matchAll(STRING_REGEX)];
        predicate = predicate.replace(STRING_REGEX, '""');
        // bolden predicate keywords
        for (const re of PREDICATE_KEYWORDS) {
          predicate = predicate.replace(re, "$1<b>$2</b>$3");
        }
        // colorize booleans
        predicate = predicate.replace(BOOLEAN_REGEX, '$1<span class="bool">$2</span>$3');
        // put colorized strings back in place
        for (const s of strings) {
          // replace just one string at a time, in order
          predicate = predicate.replace('""', `<span class="string">${s[0]}</span>`);
        }
        // replace just one predicate at a time in the global property
        p = p.replace("{}", predicate);
      }
      // colorize numbers
      p = p.replace(NUMBER_REGEX, '$1<span class="number">$2</span>$3');
      return p;
    }
  }
};


// -----------------------------------------------------------------------------
//  Application
// -----------------------------------------------------------------------------

const app = createApp({
  template: "#vue-dashboard",

  data() {
    return {
      title: "",
      text: "",
    };
  },

  computed: {},

  methods: {
    onSetupDone() {}
  },

  mounted() {
    
  }
});
  
  
// -----------------------------------------------------------------------------
//  Setup
// -----------------------------------------------------------------------------
  
app.component("RuntimeMonitor", RuntimeMonitor);

app.mount("#app");