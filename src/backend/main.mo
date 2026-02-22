import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let founderEmail = "rohitmarpalli@gmail.com";
  stable var founderPrincipal : ?Principal = null;

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

  let userProfiles = Map.empty<Principal, UserProfile>();
  let bikeListings = Map.empty<Text, BikeListing>();
  let messages = Map.empty<Text, List.List<Message>>();
  stable var founderProfile : ?FounderProfile = null;

  func generateId(prefix : Text) : Text {
    prefix # Time.now().toText();
  };

  func isFounderInternal(caller : Principal) : Bool {
    switch (founderPrincipal) {
      case (null) { false };
      case (?principal) { principal == caller };
    };
  };

  public shared ({ caller }) func initializeFounder() : async () {
    switch (founderPrincipal) {
      case (null) {
        founderPrincipal := ?caller;
        // Grant founder admin privileges
        AccessControl.assignRole(accessControlState, caller, caller, #admin);
      };
      case (?existingPrincipal) {
        if (existingPrincipal != caller) {
          Runtime.trap("Unauthorized: Founder already initialized");
        };
      };
    };
  };

  public query ({ caller }) func isFounder() : async Bool {
    isFounderInternal(caller);
  };

  public shared ({ caller }) func updateFounderProfile(profile : FounderProfile) : async () {
    if (not isFounderInternal(caller)) {
      Runtime.trap("Unauthorized: Only the founder can update the founder profile");
    };
    founderProfile := ?profile;
  };

  public query ({ caller }) func getFounderProfile() : async ?FounderProfile {
    founderProfile;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create listings");
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update listings");
    };

    switch (bikeListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        // Founder has admin privileges, so checking isAdmin covers founder
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isOwner = existing.seller == caller;

        if (not isOwner and not isAdmin) {
          Runtime.trap("Unauthorized: Only the seller or admin can update this listing");
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete listings");
    };

    switch (bikeListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        // Founder has admin privileges, so checking isAdmin covers founder
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isOwner = listing.seller == caller;

        if (not isOwner and not isAdmin) {
          Runtime.trap("Unauthorized: Only the seller or admin can delete this listing");
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send messages");
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    switch (bikeListings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isSeller = listing.seller == caller;

        switch (messages.get(listingId)) {
          case (null) { [] };
          case (?msgs) {
            let allMessages = msgs.toArray();
            if (isAdmin or isSeller) {
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their listings");
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

  public query ({ caller }) func searchListingsByPriceRange(minPrice : Nat, maxPrice : Nat) : async [BikeListing] {
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
};
