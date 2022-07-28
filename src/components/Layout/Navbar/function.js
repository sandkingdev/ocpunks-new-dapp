
 export const checkbox = () => {
    if(document.getElementById('checkbox').checked) {
      document.getElementsByTagName('html')[0].style['overflow-y'] = 'hidden';
    } else {
      document.getElementsByTagName('html')[0].style['overflow-y'] = 'auto';
    }
  };

 export const clicked = () => {
    document.getElementsByTagName('html')[0].style['overflow-y'] = 'auto';
    document.getElementById('checkbox').click();
  };

 export const dropdownCall = () => {
    document.getElementById('customDropdown').addEventListener('click', () => {
      if(document.getElementById('customDropdownDiv').classList.contains('d-none')) {
        document.getElementById('customDropdownDiv').classList.remove('d-none');
        document.getElementById('customDropdownDiv').classList.add('d-block');
      } else {
        document.getElementById('customDropdownDiv').classList.remove('d-block');
        document.getElementById('customDropdownDiv').classList.add('d-none');
      }
    });
    window.addEventListener('click', (e) => {
      if (document.getElementById('customDropdown') && document.getElementById('customDropdownDiv').classList.contains('d-block')) {
        if(e.target.id !== 'customDropdown') {
          document.getElementById('customDropdownDiv').classList.add('d-none');
        }
      }
    });
    document.getElementById('customDropdown2').addEventListener('click', () => {
      if(document.getElementById('customDropdown2Div').classList.contains('d-none')) {
        document.getElementById('customDropdown2Div').classList.remove('d-none');
        document.getElementById('customDropdown2Div').classList.add('d-block');
      } else {
        document.getElementById('customDropdown2Div').classList.remove('d-block');
        document.getElementById('customDropdown2Div').classList.add('d-none');
      }
    });
    window.addEventListener('click', (e) => {
      if (document.getElementById('customDropdown2') && document.getElementById('customDropdown2Div').classList.contains('d-block')) {
        if(e.target.id !== 'customDropdown2') {
          document.getElementById('customDropdown2Div').classList.add('d-none');
        }
      }
    });
    if (document.getElementById('customDropdown3')) {
    document.getElementById('customDropdown3').addEventListener('click', () => {
      if(document.getElementById('customDropdown3Div').classList.contains('d-none')) {
        document.getElementById('customDropdown3Div').classList.remove('d-none');
        document.getElementById('customDropdown3Div').classList.add('d-block');
      } else {
        document.getElementById('customDropdown3Div').classList.remove('d-block');
        document.getElementById('customDropdown3Div').classList.add('d-none');
      }
    });
    window.addEventListener('click', (e) => {
      if (document.getElementById('customDropdown3') && document.getElementById('customDropdown3Div').classList.contains('d-block')) {
        if(e.target.id !== 'customDropdown3') {
          document.getElementById('customDropdown3Div').classList.add('d-none');
        }
      }
    });      
  }
  };

export  const headerCall = () => {
    // document.getElementById('commingSoon').addEventListener('click', () => {
    //   if(document.getElementById('commingSoonDiv').classList.contains('d-none')) {
    //     document.getElementById('commingSoonDiv').classList.remove('d-none');
    //     document.getElementById('commingSoonDiv').classList.add('d-block');
    //   } else {
    //     document.getElementById('commingSoonDiv').classList.remove('d-block');
    //     document.getElementById('commingSoonDiv').classList.add('d-none');
    //   }
    // });
    // document.getElementById('commingSoon2').addEventListener('click', () => {
    //   if(document.getElementById('commingSoonDiv2').classList.contains('d-none')) {
    //     document.getElementById('commingSoonDiv2').classList.remove('d-none');
    //     document.getElementById('commingSoonDiv2').classList.add('d-block');
    //   } else {
    //     document.getElementById('commingSoonDiv2').classList.remove('d-block');
    //     document.getElementById('commingSoonDiv2').classList.add('d-none');
    //   }
    // });
    // document.getElementById('commingSoon3').addEventListener('click', () => {
    //   if(document.getElementById('commingSoonDiv3').classList.contains('d-none')) {
    //     document.getElementById('commingSoonDiv3').classList.remove('d-none');
    //     document.getElementById('commingSoonDiv3').classList.add('d-block');
    //   } else {
    //     document.getElementById('commingSoonDiv3').classList.remove('d-block');
    //     document.getElementById('commingSoonDiv3').classList.add('d-none');
    //   }
    // });
    // window.addEventListener('click', (e) => {
    //   if (document.getElementById('commingSoonDiv') && document.getElementById('commingSoonDiv').classList.contains('d-block')) {
    //     if(e.target.id !== 'commingSoon' && e.target.id !== 'commingSoonImg') {
    //       document.getElementById('commingSoonDiv').classList.add('d-none');
    //     }
    //   }
    // });
    // window.addEventListener('click', (e) => {
    //   if (document.getElementById('commingSoonDiv3') && document.getElementById('commingSoonDiv3').classList.contains('d-block')) {
    //     if(e.target.id !== 'commingSoon3') {
    //       document.getElementById('commingSoonDiv3').classList.add('d-none');
    //     }
    //   }
    // });
    // window.addEventListener('click', (e) => {
    //   if (document.getElementById('commingSoonDiv2') && document.getElementById('commingSoonDiv2').classList.contains('d-block')) {
    //     if(e.target.id !== 'commingSoon2' && e.target.id !== 'wrappedCommingSoonDiv' && e.target.id !== 'commingSoonImg') {
    //       document.getElementById('commingSoonDiv2').classList.add('d-none');
    //     }
    //   }
    // });
  };
  
  