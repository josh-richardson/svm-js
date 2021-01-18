source_svm() {
  SOURCE_SVM="\nwhich svm &>/dev/null && source \$(which svm)"
  if [ -f "$HOME/.bashrc" ]; then
    bash_rc="$HOME/.bashrc"
    touch "${bash_rc}"
    if ! grep -qc 'which svm' "${bash_rc}"; then
      echo "Adding source string to ${bash_rc}"
      printf "${SOURCE_SVM}\n" >>"${bash_rc}"
    else
      echo "Skipped update of ${bash_rc} (source string already present)"
    fi
  fi
  if [ -f "$HOME/.bash_profile" ]; then
    bash_profile="${HOME}/.bash_profile"
    touch "${bash_profile}"
    if ! grep -qc 'which svm' "${bash_profile}"; then
      echo "Adding source string to ${bash_profile}"
      printf "${SOURCE_SVM}\n" >>"${bash_profile}"
    else
      echo "Skipped update of ${bash_profile} (source string already present)"
    fi
  fi
  if [ -f "$HOME/.bash_login" ]; then
    bash_login="$HOME/.bash_login"
    touch "${bash_login}"
    if ! grep -qc 'which svm' "${bash_login}"; then
      echo "Adding source string to ${bash_login}"
      printf "${SOURCE_SVM}\n" >>"${bash_login}"
    else
      echo "Skipped update of ${bash_login} (source string already present)"
    fi
  fi
  if [ -f "$HOME/.profile" ]; then
    profile="$HOME/.profile"
    touch "${profile}"
    if ! grep -qc 'which svm' "${profile}"; then
      echo "Adding source string to ${profile}"
      printf "$SOURCE_SVM\n" >>"${profile}"
    else
      echo "Skipped update of ${profile} (source string already present)"
    fi
  fi

  if [ -f "$(command -v zsh 2>/dev/null)" ]; then
    file="$HOME/.zshrc"
    touch "${file}"
    if ! grep -qc 'which svm' "${file}"; then
      echo "Adding source string to ${file}"
      printf "$SOURCE_SVM\n" >>"${file}"
    else
      echo "Skipped update of ${file} (source string already present)"
    fi
  fi
}

echo "Executing SVM post-install"
source_svm
