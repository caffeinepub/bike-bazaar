import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type FounderProfile = {
    name : Text;
    address : Text;
    contactNumber : Text;
    emailAddress : Text;
    instagramProfile : Text;
  };

  public type UserProfile = {
    name : Text;
    contactInfo : Text;
  };

  public type BuyerProfile = {
    fullName : Text;
    phoneNumber : Text;
    email : Text;
    address : Text;
    profilePhoto : ?Storage.ExternalBlob;
    aadhaarNumber : Text;
    panNumber : Text;
    aadhaarDocument : ?Storage.ExternalBlob;
    panDocument : ?Storage.ExternalBlob;
    isProfileComplete : Bool;
    createdAt : Int;
  };

  public type Condition = {
    #excellent;
    #good;
    #fair;
  };

  public type BikeListing = {
    id : Text;
    title : Text;
    brand : Text;
    model : Text;
    year : Nat;
    price : Nat;
    mileage : ?Nat;
    condition : Condition;
    description : Text;
    seller : Principal;
    contactInfo : Text;
    listingDate : Int;
    available : Bool;
  };

  public type Message = {
    id : Text;
    sender : Principal;
    receiver : Principal;
    content : Text;
    timestamp : Int;
    listingId : Text;
  };

  public type AdminCredentials = {
    email : Text;
    passwordHash : Text;
  };

  public type WebsiteContent = {
    aboutPage : Text;
    heroSection : Text;
    footerInfo : Text;
  };

  public type AnalyticsData = {
    totalVisitors : Nat;
    activeListings : Nat;
    registeredUsers : Nat;
    usageStats : [UsageStat];
  };

  public type UsageStat = {
    timestamp : Int;
    visitors : Nat;
    listings : Nat;
    users : Nat;
  };

  var founderProfile : ?FounderProfile = null;
  var founderPrincipal : ?Principal = null;
  let userProfiles = Map.empty<Principal, UserProfile>();
  let buyerProfiles = Map.empty<Principal, BuyerProfile>();
  let bikeListings = Map.empty<Text, BikeListing>();
  let messages = Map.empty<Text, List.List<Message>>();
  let adminCredentials = Map.empty<Text, AdminCredentials>();
  var websiteContent : WebsiteContent = {
    aboutPage = "Default about page content";
    heroSection = "Default hero section content";
    footerInfo = "Default footer info";
  };
  let usageStats = List.empty<UsageStat>();

  func generateId(prefix : Text) : Text {
    prefix # Time.now().toText();
  };

  func isFounderInternal(caller : Principal) : Bool {
    switch (founderPrincipal) {
      case (null) { false };
      case (?principal) { principal == caller };
    };
  };

  func isAdminOrFounder(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller) or isFounderInternal(caller);
  };

  func isBuyerProfileCompleteInternal(caller : Principal) : Bool {
    switch (buyerProfiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.isProfileComplete };
    };
  };

  func hashPassword(password : Text) : Text {
    password;
  };

  public shared ({ caller }) func initializeFounder() : async () {
    switch (founderPrincipal) {
      case (null) {
        founderPrincipal := ?caller;
        AccessControl.assignRole(accessControlState, caller, caller, #admin);
        let admin : AdminCredentials = {
          email = "marpallirohit@gmail.com";
          passwordHash = hashPassword("83050@Mr");
        };
        adminCredentials.add(admin.email, admin);
      };
      case (?existingPrincipal) {
        if (existingPrincipal != caller) {
          Runtime.trap("Unauthorized: Founder already initialized");
        };
      };
    };
  };

  public shared ({ caller }) func adminLogin(email : Text, password : Text) : async Bool {
    switch (adminCredentials.get(email)) {
      case (null) { false };
      case (?credentials) { credentials.passwordHash == hashPassword(password) };
    };
  };

  public query ({ caller }) func isFounder() : async Bool {
    isFounderInternal(caller);
  };

  public shared ({ caller }) func updateFounderProfile(profile : FounderProfile) : async () {
    if (not isAdminOrFounder(caller)) {
      Runtime.trap("Unauthorized: Only admin or founder can update the founder profile");
    };
    founderProfile := ?profile;
  };

  public query ({ caller }) func getFounderProfile() : async ?FounderProfile {
    founderProfile;
  };

  public shared ({ caller }) func createBuyerProfile(
    fullName : Text,
    phoneNumber : Text,
    email : Text,
    address : Text,
    aadhaarNumber : Text,
    panNumber : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create buyer profiles");
    };

    let profile : BuyerProfile = {
      fullName;
      phoneNumber;
      email;
      address;
      profilePhoto = null;
      aadhaarNumber;
      panNumber;
      aadhaarDocument = null;
      panDocument = null;
      isProfileComplete = false;
      createdAt = Time.now();
    };

    buyerProfiles.add(caller, profile);
  };

  public shared ({ caller }) func uploadProfilePhoto(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload profile photos");
    };

    switch (buyerProfiles.get(caller)) {
      case (null) { Runtime.trap("Buyer profile not found") };
      case (?profile) {
        let updated : BuyerProfile = {
          profile with
          profilePhoto = ?blob;
        };
        buyerProfiles.add(caller, updated);
      };
    };
  };

  public shared ({ caller }) func uploadAadhaarDocument(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload documents");
    };

    switch (buyerProfiles.get(caller)) {
      case (null) { Runtime.trap("Buyer profile not found") };
      case (?profile) {
        let updated : BuyerProfile = {
          profile with
          aadhaarDocument = ?blob;
        };
        buyerProfiles.add(caller, updated);
      };
    };
  };

  public shared ({ caller }) func uploadPanDocument(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload documents");
    };

    switch (buyerProfiles.get(caller)) {
      case (null) { Runtime.trap("Buyer profile not found") };
      case (?profile) {
        let updated : BuyerProfile = {
          profile with
          panDocument = ?blob;
        };
        buyerProfiles.add(caller, updated);
      };
    };
  };

  public shared ({ caller }) func completeBuyerProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can complete profiles");
    };

    switch (buyerProfiles.get(caller)) {
      case (null) { Runtime.trap("Buyer profile not found") };
      case (?profile) {
        let updated : BuyerProfile = {
          profile with isProfileComplete = true
        };
        buyerProfiles.add(caller, updated);
      };
    };
  };

  public query ({ caller }) func getBuyerProfile(user : Principal) : async ?BuyerProfile {
    if (caller != user and not isAdminOrFounder(caller)) {
      Runtime.trap("Unauthorized: Can only view your own buyer profile or must be admin/founder");
    };
    buyerProfiles.get(user);
  };

  public query ({ caller }) func getAllBuyerProfiles() : async [BuyerProfile] {
    if (not isAdminOrFounder(caller)) {
      Runtime.trap("Unauthorized: Only admin or founder can view all buyer profiles");
    };
    buyerProfiles.values().toArray();
  };

  public shared ({ caller }) func createListing(
    title : Text,
    brand : Text,
    model : Text,
    year : Nat,
    price : Nat,
    mileage : ?Nat,
    condition : Condition,
    description : Text,
    contactInfo : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create listings");
    };

    let id = generateId("listing");
    let listing : BikeListing = {
      id;
      title;
      brand;
      model;
      year;
      price;
      mileage;
      condition;
      description;
      seller = caller;
      contactInfo;
      listingDate = Time.now();
      available = true;
    };
    bikeListings.add(id, listing);
    id;
  };

  public query ({ caller }) func getListing(id : Text) : async BikeListing {
    switch (bikeListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };
  };

  public query ({ caller }) func getAllListings() : async [BikeListing] {
    bikeListings.values().toArray().reverse();
  };

  public shared ({ caller }) func updateListing(
    id : Text,
    title : Text,
    brand : Text,
    model : Text,
    year : Nat,
    price : Nat,
    mileage : ?Nat,
    condition : Condition,
    description : Text,
    contactInfo : Text,
    available : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update listings");
    };

    switch (bikeListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        let isAdminOrFounderRole = isAdminOrFounder(caller);
        let isOwner = existing.seller == caller;

        if (not isOwner and not isAdminOrFounderRole) {
          Runtime.trap("Unauthorized: Only the seller, admin, or founder can update this listing");
        };

        let updated : BikeListing = {
          id;
          title;
          brand;
          model;
          year;
          price;
          mileage;
          condition;
          description;
          seller = existing.seller;
          contactInfo;
          listingDate = existing.listingDate;
          available;
        };
        bikeListings.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteListing(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete listings");
    };

    switch (bikeListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let isAdminOrFounderRole = isAdminOrFounder(caller);
        let isOwner = listing.seller == caller;

        if (not isOwner and not isAdminOrFounderRole) {
          Runtime.trap("Unauthorized: Only the seller, admin, or founder can delete this listing");
        };
        bikeListings.remove(id);
      };
    };
  };

  public shared ({ caller }) func sendMessage(
    receiver : Principal,
    content : Text,
    listingId : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send messages");
    };

    switch (bikeListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (_) {
        let message : Message = {
          id = generateId("msg");
          sender = caller;
          receiver;
          content;
          timestamp = Time.now();
          listingId;
        };

        let existingMessages = switch (messages.get(listingId)) {
          case (null) { List.empty<Message>() };
          case (?msgs) { msgs };
        };

        existingMessages.add(message);
        messages.add(listingId, existingMessages);
      };
    };
  };

  public query ({ caller }) func getMessagesForListing(listingId : Text) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view messages");
    };

    switch (bikeListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let isAdminOrFounderRole = isAdminOrFounder(caller);
        let isSeller = listing.seller == caller;

        switch (messages.get(listingId)) {
          case (null) { [] };
          case (?msgs) {
            let allMessages = msgs.toArray();
            if (isAdminOrFounderRole or isSeller) {
              allMessages;
            } else {
              let filtered = allMessages.filter(
                func(msg : Message) : Bool {
                  msg.sender == caller or msg.receiver == caller;
                }
              );
              filtered;
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getMyListings() : async [BikeListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their listings");
    };

    let allListings = bikeListings.values().toArray();
    let filtered = allListings.filter(
      func(listing) {
        listing.seller == caller;
      }
    );
    filtered.reverse();
  };

  public query ({ caller }) func searchListingsByBrand(brand : Text) : async [BikeListing] {
    let allListings = bikeListings.values().toArray();
    let filtered = allListings.filter(
      func(listing) {
        listing.brand.contains(#text brand);
      }
    );
    filtered.reverse();
  };

  public query ({ caller }) func searchListingsByPriceRange(
    minPrice : Nat,
    maxPrice : Nat,
  ) : async [BikeListing] {
    let allListings = bikeListings.values().toArray();
    let filtered = allListings.filter(
      func(listing) {
        listing.price >= minPrice and listing.price <= maxPrice;
      }
    );
    filtered.reverse();
  };

  public query ({ caller }) func getAvailableListings() : async [BikeListing] {
    let allListings = bikeListings.values().toArray();
    let filtered = allListings.filter(
      func(listing) {
        listing.available;
      }
    );
    filtered.reverse();
  };

  public query ({ caller }) func getMyBuyerProfile() : async ?BuyerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their buyer profile");
    };
    buyerProfiles.get(caller);
  };

  public query ({ caller }) func isBuyerProfileComplete() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check profile completion");
    };
    isBuyerProfileCompleteInternal(caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isAdminOrFounder(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be admin/founder");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateWebsiteContent(content : WebsiteContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update website content");
    };
    websiteContent := content;
  };

  public query ({ caller }) func getWebsiteContent() : async WebsiteContent {
    websiteContent;
  };

  public shared ({ caller }) func addUsageStat(stat : UsageStat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add usage statistics");
    };
    usageStats.add(stat);
  };

  public query ({ caller }) func getAnalyticsData() : async AnalyticsData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view analytics data");
    };
    {
      totalVisitors = usageStats.values().toArray().foldLeft(
        0,
        func(acc, stat) { acc + stat.visitors },
      );
      activeListings = bikeListings.size();
      registeredUsers = userProfiles.size();
      usageStats = usageStats.toArray();
    };
  };
};
