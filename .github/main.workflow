workflow "Build" {
  on = "push"
  resolves = ["test"]
}

action "install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run lint"
  needs = ["install"]
}

action "build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["lint"]
  args = "run build"
}

action "test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["build"]
  args = "test"
}
