const isValidUrl = require("../index");

const chai = require("chai");
const expect = chai.expect;

describe("is a valid url: ", () => {
  it("url with http or https protocols", () => {
    expect(isValidUrl("https://www.google.com")).to.equal(true);
    expect(isValidUrl("http://www.google.com")).to.equal(true);
    expect(isValidUrl("htt://www.google.com")).to.equal(false);
    expect(isValidUrl("http:/www.google.com")).to.equal(false);
    expect(isValidUrl("http:www.google.com")).to.equal(false);
    expect(isValidUrl("://www.google.com")).to.equal(false);
    expect(isValidUrl("http//www.google.com")).to.equal(false);
    expect(isValidUrl("https//www.google.com")).to.equal(false);
    expect(isValidUrl("foo://www.google.com")).to.equal(false);
  });

  it("url without protocols", () => {
    expect(isValidUrl("www.google.com")).to.equal(true);
    expect(isValidUrl("google.com")).to.equal(true);
  });

  it("url without www.", function() {
    expect(isValidUrl("http://google.com")).to.equal(true);
    expect(isValidUrl("https://google.com")).to.equal(true);
  });

  it("url with a domain ", function() {
    expect(isValidUrl("http://google")).to.equal(false);
    expect(isValidUrl("https://google.")).to.equal(false);
    expect(isValidUrl("http://google.com")).to.equal(true);
    expect(isValidUrl("https://google.b")).to.equal(false);
  });

  it("url with a hostname ", function() {
    expect(isValidUrl("http://.com")).to.equal(false);
  });

  it("url with only letters, numbers or hyphens", function() {
    expect(isValidUrl("awsome-url.com")).to.equal(true);
    expect(isValidUrl("awsome_url.com")).to.equal(false);
    expect(isValidUrl("çè_-è_&.com_(")).to.equal(false);
    expect(isValidUrl("awsome22url.com")).to.equal(true);
    expect(isValidUrl("123456789.zip")).to.equal(true);
  });

  it("url do not start or end with hyphens", function() {
    expect(isValidUrl("awsome-url.com-")).to.equal(false);
    expect(isValidUrl("-awsome-url.com")).to.equal(false);
    expect(isValidUrl("-awsome-url.-com")).to.equal(false);
    expect(isValidUrl("awsome-url-.com")).to.equal(false);
  });

  it("do not validate other than strings", function() {
    expect(isValidUrl({})).to.equal(false);
    expect(isValidUrl([])).to.equal(false);
    expect(isValidUrl(123456)).to.equal(false);
  });
});